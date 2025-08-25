const { Pool } = require('pg');
const { dbConfig } = require('./dbConfig');
const seedData = require('./seed_data.json');

// Connect to PostgreSQL database
const pool = new Pool({
    user: dbConfig.user,
    host: dbConfig.host,
    database: dbConfig.database,
    password: dbConfig.password,
    port: dbConfig.port,
});

const seedDatabase = async () => {
    const client = await pool.connect();

    try {
        console.log('Seeding database...');
        // Delete existing data
        await client.query(`
            DELETE FROM widget_analytics;
            DELETE FROM widgets;            
            DELETE FROM token_metrics;
            DELETE FROM liquidity_pools;
        `);

        // Insert liquidity pools
        const liquidityPoolIds = {};
        for (const lp of seedData.liquidityPools) {
            const result = await client.query(
                `INSERT INTO liquidity_pools (
                    name, description, token_symbol, token_address, lp_address, network, lp_type, wallet_address, status, total_liquidity, apy, min_investment, max_investment, created_at, updated_at
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
                RETURNING id`,
                [
                    lp.name,
                    lp.description,
                    lp.tokenSymbol,
                    lp.tokenAddress,
                    lp.lpAddress,
                    lp.network,
                    lp.lpType,
                    lp.walletAddress,
                    lp.status,
                    lp.totalLiquidity,
                    lp.apy,
                    lp.minInvestment,
                    lp.maxInvestment,
                    lp.createdAt,
                    lp.updatedAt,
                ]
            );
            liquidityPoolIds[lp.lpAddress] = result.rows[0].id;
        }

        // Insert widgets
        for (const widget of seedData.widgets) {
            await client.query(
                `INSERT INTO widgets (
                    hash, token_id, project_id, lp_id, theme, position, custom_styles, is_active, created_at, updated_at
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
                [
                    widget.hash,
                    widget.tokenId,      
                    widget.projectId,    
                    liquidityPoolIds[widget.lpId],
                    widget.theme,
                    widget.position,
                    JSON.stringify(widget.customStyles),
                    widget.isActive,
                    widget.createdAt,
                    widget.updatedAt,
                ]
            );
        }

        // Insert widget analytics
        for (const analytics of seedData.widget_analytics) {
            await client.query(
                `INSERT INTO widget_analytics (
                    widget_hash, event_type, domain, user_agent, timestamp
                ) VALUES ($1, $2, $3, $4, $5)`,
                [
                    analytics.widgetHash,
                    analytics.eventType,
                    analytics.domain,
                    analytics.userAgent,
                    analytics.timestamp,
                ]
            );
        }

        // Insert token metrics
        for (const metric of seedData.token_metrics) {
            await client.query(
                `INSERT INTO token_metrics (
                    lp_id, price_usd, market_cap, volume_24h, circulating_supply, total_supply, price_change_24h, volume_change_24h, timestamp
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                [
                    liquidityPoolIds[metric.lpId],
                    metric.priceUsd,
                    metric.marketCap,
                    metric.volume24h,
                    metric.circulatingSupply,
                    metric.totalSupply,
                    metric.priceChange24h,
                    metric.volumeChange24h,
                    metric.timestamp,
                ]
            );
        }

        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        client.release();
        pool.end();
    }
};

seedDatabase();