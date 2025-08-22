const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { v4: uuidv4 } = require('uuid');
const Joi = require('joi');
const { Pool } = require('pg');
const { dbConfig } = require('./db/dbConfig');

// Connect to PostgreSQL database
const pool = new Pool({
  user: dbConfig.user,
  host: dbConfig.host,
  database: dbConfig.database,
  password: dbConfig.password,
  port: dbConfig.port,
});

pool.connect()
  .then(client => {
    console.log('Connected to DB');
    client.release();
  })
  .catch(err => console.error('Error with DB connection', err));


const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// In-memory storage (replace with database in production)
let widgets = new Map();
let analytics = [];
let liquidityPools = new Map();
let users = new Map();

// Validation schemas
const widgetSchema = Joi.object({
  tokenId: Joi.string().required(),
  theme: Joi.string().valid('light', 'dark').default('dark'),
  position: Joi.string().valid('bottom-right', 'bottom-left', 'top-right', 'top-left').default('bottom-right'),
  customStyles: Joi.object().default({}),
  projectId: Joi.string().required(),
  lpId: Joi.string().optional()
});

const analyticsSchema = Joi.object({
  widgetHash: Joi.string().required(),
  eventType: Joi.string().valid('embed', 'view', 'sale', 'wallet_connect').required(),
  domain: Joi.string().required(),
  userAgent: Joi.string().optional(),
  amount: Joi.number().optional(),
  currency: Joi.string().optional()
});

const liquidityPoolSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
  tokenSymbol: Joi.string().required(),
  tokenAddress: Joi.string().required(),
  lpAddress: Joi.string().required(),
  network: Joi.string().required(),
  lpType: Joi.string().valid('base', 'stellar', 'ethereum', 'polygon', 'arbitrum').required(),
  walletAddress: Joi.string().required(),
  totalLiquidity: Joi.number().default(0),
  apy: Joi.number().default(0),
  minInvestment: Joi.number().default(0),
  maxInvestment: Joi.number().default(0)
});

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  walletAddress: Joi.string().optional()
});

// Generate unique widget hash
const generateWidgetHash = (tokenId, projectId) => {
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const baseString = `${tokenId}-${projectId}-${timestamp}-${randomSuffix}`;

  let hash = 0;
  for (let i = 0; i < baseString.length; i++) {
    const char = baseString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }

  return `dob-${Math.abs(hash).toString(36)}-${randomSuffix}`;
};

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// User Management API

// Get user by wallet address
app.get('/api/users/wallet/:walletAddress', (req, res) => {
  try {
    const { walletAddress } = req.params;
    const user = Array.from(users.values()).find(u => u.walletAddress === walletAddress);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      user: user
    });
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create or update user
app.post('/api/users', (req, res) => {
  try {
    const { error, value } = userSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    let user = Array.from(users.values()).find(u => u.walletAddress === value.walletAddress);

    if (user) {
      // Update existing user
      user = { ...user, ...value, updatedAt: new Date().toISOString() };
      users.set(user.id, user);
    } else {
      // Create new user
      user = {
        id: uuidv4(),
        ...value,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      users.set(user.id, user);
    }

    res.status(201).json({
      success: true,
      user: user
    });
  } catch (error) {
    console.error('Error creating/updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Liquidity Pool Management API

// Get liquidity pools by wallet address
app.get('/api/liquidity-pools/wallet/:walletAddress', (req, res) => {
  try {
    const { walletAddress } = req.params;
    const userLPs = Array.from(liquidityPools.values()).filter(lp => lp.walletAddress === walletAddress);

    res.json({
      success: true,
      liquidityPools: userLPs
    });
  } catch (error) {
    console.error('Error getting liquidity pools:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get liquidity pool by ID
app.get('/api/liquidity-pools/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('SELECT * FROM liquidity_pools WHERE id = $1', [id]);

    if (!result) {
      return res.status(404).json({ error: 'Liquidity pool not found' });
    }

    res.json({
      success: true,
      liquidityPool: result
    });
  } catch (error) {
    console.error('Error getting liquidity pool:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get real-time token metrics
app.get('/api/liquidity-pools/:id/metrics', async (req, res) => {
  try {
    const { id } = req.params;

    const lpResult = await pool.query('SELECT * FROM liquidity_pools WHERE id = $1', [id]);
    
    if (lpResult.rows.length === 0) {
      return res.status(404).json({ error: 'Liquidity pool not exist' });
    }
    
    const metricsResult = await pool.query('SELECT * FROM token_metrics WHERE lp_id = $1', [id]);

    if (!metricsResult) {
      return res.status(404).json({ error: 'Token metrics not finded' });
    }

    res.json({
      success: true,      
      metrics: metricsResult.rows
    });
  } catch (error) {
    console.error('Error getting token metrics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all liquidity pools
app.get('/api/liquidity-pools', async (req, res) => {
  try {

    const result = await pool.query('SELECT * FROM liquidity_pools');

    res.json({
      success: true,
      liquidityPools: result
    });

  } catch (error) {
    console.error('Error getting liquidity pools:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new liquidity pool
app.post('/api/liquidity-pools', (req, res) => {
  try {
    const { error, value } = liquidityPoolSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const lp = {
      id: uuidv4(),
      ...value,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    liquidityPools.set(lp.id, lp);

    res.status(201).json({
      success: true,
      liquidityPool: lp
    });
  } catch (error) {
    console.error('Error creating liquidity pool:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update liquidity pool
app.put('/api/liquidity-pools/:id', (req, res) => {
  try {
    const { id } = req.params;
    const lp = liquidityPools.get(id);

    if (!lp) {
      return res.status(404).json({ error: 'Liquidity pool not found' });
    }

    const { error, value } = liquidityPoolSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const updatedLP = {
      ...lp,
      ...value,
      updatedAt: new Date().toISOString()
    };

    liquidityPools.set(id, updatedLP);

    res.json({
      success: true,
      liquidityPool: updatedLP
    });
  } catch (error) {
    console.error('Error updating liquidity pool:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Widget Management API

// Create new widget with guided flow
app.post('/api/widgets/guided', (req, res) => {
  try {
    const {
      step,
      walletAddress,
      selectedLPId,
      projectName,
      projectDescription,
      tokenId,
      theme,
      position
    } = req.body;

    // Step 1: Get user's liquidity pools
    if (step === 'get-lps') {
      const userLPs = Array.from(liquidityPools.values()).filter(lp => lp.walletAddress === walletAddress);

      return res.json({
        success: true,
        step: 'select-lp',
        liquidityPools: userLPs
      });
    }

    // Step 2: Create project with selected LP
    if (step === 'create-project') {
      if (!selectedLPId || !projectName) {
        return res.status(400).json({ error: 'LP ID and project name are required' });
      }

      const project = {
        id: uuidv4(),
        name: projectName,
        description: projectDescription || '',
        color: '#3b82f6',
        userId: 'user-1', // This would come from auth in production
        lpId: selectedLPId,
        createdAt: new Date().toISOString()
      };

      return res.json({
        success: true,
        step: 'create-widget',
        project: project
      });
    }

    // Step 3: Create widget
    if (step === 'create-widget') {
      if (!tokenId || !selectedLPId) {
        return res.status(400).json({ error: 'Token ID and LP ID are required' });
      }

      const widgetHash = generateWidgetHash(tokenId, selectedLPId);
      const now = new Date().toISOString();

      const widget = {
        hash: widgetHash,
        tokenId: tokenId,
        theme: theme || 'dark',
        position: position || 'bottom-right',
        customStyles: {},
        projectId: uuidv4(), // This would be the actual project ID
        lpId: selectedLPId,
        embedCode: `https://dobprotocol.com/widget/${widgetHash}`,
        activeLinks: 0,
        tokensSold: 0,
        views: 0,
        conversions: 0,
        revenue: 0,
        createdAt: now,
        lastUpdated: now,
        isActive: true
      };

      widgets.set(widgetHash, widget);

      return res.json({
        success: true,
        step: 'complete',
        widget: widget
      });
    }

    res.status(400).json({ error: 'Invalid step' });
  } catch (error) {
    console.error('Error in guided widget creation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new widget
app.post('/api/widgets', (req, res) => {
  try {
    const { error, value } = widgetSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const widgetHash = generateWidgetHash(value.tokenId, value.projectId);
    const now = new Date().toISOString();

    const widget = {
      hash: widgetHash,
      tokenId: value.tokenId,
      theme: value.theme,
      position: value.position,
      customStyles: value.customStyles,
      projectId: value.projectId,
      lpId: value.lpId,
      embedCode: `https://dobprotocol.com/widget/${widgetHash}`,
      activeLinks: 0,
      tokensSold: 0,
      views: 0,
      conversions: 0,
      revenue: 0,
      createdAt: now,
      lastUpdated: now,
      isActive: true
    };

    widgets.set(widgetHash, widget);

    res.status(201).json({
      success: true,
      widget: widget
    });
  } catch (error) {
    console.error('Error creating widget:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get widget by hash
app.get('/api/widgets/:hash', (req, res) => {
  try {
    const { hash } = req.params;
    const widget = widgets.get(hash);

    if (!widget) {
      return res.status(404).json({ error: 'Widget not found' });
    }

    res.json({
      success: true,
      widget: widget
    });
  } catch (error) {
    console.error('Error getting widget:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update widget
app.put('/api/widgets/:hash', (req, res) => {
  try {
    const { hash } = req.params;
    const widget = widgets.get(hash);

    if (!widget) {
      return res.status(404).json({ error: 'Widget not found' });
    }

    const { error, value } = widgetSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const updatedWidget = {
      ...widget,
      ...value,
      lastUpdated: new Date().toISOString()
    };

    widgets.set(hash, updatedWidget);

    res.json({
      success: true,
      widget: updatedWidget
    });
  } catch (error) {
    console.error('Error updating widget:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete widget
app.delete('/api/widgets/:hash', (req, res) => {
  try {
    const { hash } = req.params;
    const widget = widgets.get(hash);

    if (!widget) {
      return res.status(404).json({ error: 'Widget not found' });
    }

    widgets.delete(hash);

    res.json({
      success: true,
      message: 'Widget deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting widget:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all widgets
app.get('/api/widgets', (req, res) => {
  try {
    const { projectId } = req.query;
    let widgetsList = Array.from(widgets.values());

    if (projectId) {
      widgetsList = widgetsList.filter(widget => widget.projectId === projectId);
    }

    res.json({
      success: true,
      widgets: widgetsList
    });
  } catch (error) {
    console.error('Error getting widgets:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Analytics API

// Track analytics event
app.post('/api/analytics', (req, res) => {
  try {
    const { error, value } = analyticsSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const event = {
      id: uuidv4(),
      ...value,
      timestamp: new Date().toISOString()
    };

    analytics.push(event);

    // Update widget stats if it's a view or sale event
    const widget = widgets.get(value.widgetHash);
    if (widget) {
      if (value.eventType === 'view') {
        widget.views += 1;
      } else if (value.eventType === 'sale') {
        widget.tokensSold += 1;
        widget.revenue += value.amount || 0;
        widget.conversions = (widget.tokensSold / widget.views) * 100;
      }
      widget.lastUpdated = new Date().toISOString();
      widgets.set(value.widgetHash, widget);
    }

    res.status(201).json({
      success: true,
      event: event
    });
  } catch (error) {
    console.error('Error tracking analytics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get analytics for widget
app.get('/api/analytics/:widgetHash', (req, res) => {
  try {
    const { widgetHash } = req.params;
    const { eventType, startDate, endDate } = req.query;

    let widgetAnalytics = analytics.filter(event => event.widgetHash === widgetHash);

    if (eventType) {
      widgetAnalytics = widgetAnalytics.filter(event => event.eventType === eventType);
    }

    if (startDate) {
      widgetAnalytics = widgetAnalytics.filter(event => new Date(event.timestamp) >= new Date(startDate));
    }

    if (endDate) {
      widgetAnalytics = widgetAnalytics.filter(event => new Date(event.timestamp) <= new Date(endDate));
    }

    res.json({
      success: true,
      analytics: widgetAnalytics
    });
  } catch (error) {
    console.error('Error getting analytics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get dashboard stats
app.get('/api/analytics/dashboard', (req, res) => {
  try {
    const { projectId } = req.query;
    let widgetsList = Array.from(widgets.values());

    if (projectId) {
      widgetsList = widgetsList.filter(widget => widget.projectId === projectId);
    }

    const totalStats = widgetsList.reduce((acc, widget) => ({
      activeLinks: acc.activeLinks + widget.activeLinks,
      tokensSold: acc.tokensSold + widget.tokensSold,
      views: acc.views + widget.views,
      revenue: acc.revenue + widget.revenue
    }), { activeLinks: 0, tokensSold: 0, views: 0, revenue: 0 });

    res.json({
      success: true,
      stats: totalStats,
      widgets: widgetsList.length
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`DOB Link Backend API running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

module.exports = app; 