const { Pool } = require('pg');
const { dbConfig } = require('./dbConfig');

const pool = new Pool({
    user: dbConfig.user,
    host: dbConfig.host,
    database: dbConfig.database,
    password: dbConfig.password,
    port: dbConfig.port,
});

const createTables = async () => {
    const client = await pool.connect();

    try {
        console.log('Creating tables...');
        // Delete existing data
        await client.query(`
            DROP TABLE IF EXISTS widget_analytics;
            DROP TABLE IF EXISTS widgets;
            DROP TABLE IF EXISTS token_metrics;
            DROP TABLE IF EXISTS liquidity_pools;
            `);
        // Liquidity Pools table creation
        const createLiquidityPoolsTable = `
            CREATE TABLE liquidity_pools (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                name VARCHAR NOT NULL,
                description TEXT,
                token_symbol VARCHAR NOT NULL,
                token_address VARCHAR NOT NULL,
                lp_address VARCHAR NOT NULL,
                network VARCHAR NOT NULL,
                wallet_address VARCHAR NOT NULL,
                status VARCHAR DEFAULT 'active',
                total_liquidity DECIMAL,
                apy DECIMAL,
                min_investment DECIMAL,
                max_investment DECIMAL,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );
        `;
        // Token Metrics table creation
        const createTokenMetricsTable = `
            CREATE TABLE token_metrics (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                lp_id UUID REFERENCES liquidity_pools(id) ON DELETE CASCADE,
                price_usd DECIMAL,
                market_cap DECIMAL,
                volume_24h DECIMAL,
                circulating_supply DECIMAL,
                total_supply DECIMAL,
                price_change_24h DECIMAL,
                volume_change_24h DECIMAL,
                timestamp TIMESTAMP DEFAULT NOW()
            );
            `;
        // Widgets table creation
        const creteTableWidgets = `
            CREATE TABLE widgets (
                hash VARCHAR UNIQUE NOT NULL,
                lp_id UUID REFERENCES liquidity_pools(id) ON DELETE CASCADE,
                theme VARCHAR CHECK (theme IN ('light', 'dark')),
                position VARCHAR CHECK (position IN ('bottom-right', 'bottom-left', 'top-right', 'top-left')),
                custom_styles JSONB,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW(),
                PRIMARY KEY (hash)
            );
    `;
        // Analytics table creation
        const creteTableAnalytics = `
            CREATE TABLE widget_analytics (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                widget_hash VARCHAR REFERENCES widgets(hash) ON DELETE CASCADE,
                event_type VARCHAR CHECK (event_type IN ('view', 'click', 'wallet_connect')),
                domain VARCHAR,
                user_agent TEXT,
                timestamp TIMESTAMP DEFAULT NOW()
            );
        `;

        await client.query(createLiquidityPoolsTable);
        await client.query(createTokenMetricsTable);
        await client.query(creteTableWidgets);
        await client.query(creteTableAnalytics);

        console.log('Tables created successfully!');
    } catch (error) {
        console.error('Error creating tables:', error);
    } finally {
        client.release();
        pool.end();
    }
};

createTables();