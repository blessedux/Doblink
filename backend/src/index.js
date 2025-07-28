const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { v4: uuidv4 } = require('uuid');
const Joi = require('joi');

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

// Validation schemas
const widgetSchema = Joi.object({
  tokenId: Joi.string().required(),
  theme: Joi.string().valid('light', 'dark').default('dark'),
  position: Joi.string().valid('bottom-right', 'bottom-left', 'top-right', 'top-left').default('bottom-right'),
  customStyles: Joi.object().default({}),
  projectId: Joi.string().required()
});

const analyticsSchema = Joi.object({
  widgetHash: Joi.string().required(),
  eventType: Joi.string().valid('embed', 'view', 'sale', 'wallet_connect').required(),
  domain: Joi.string().required(),
  userAgent: Joi.string().optional(),
  amount: Joi.number().optional(),
  currency: Joi.string().optional()
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

// Widget Management API

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