# API/ LIQUIDITY POOLS

## ALL LIQUIDITY POOLS

### DESCRIPTION
GET ALL AVAILABLE LIQUIDITY POOLS

### ENDPOINT
`GET /api/liquidity-pools`


### (JSON) PARAMETERS 
NONE

### EXAMPLE REQUEST
`GET /api/liquidity-pools`

### POSSIBLE RESULTS

```json
200 OK

{
"success": true,
    "liquidityPools": {
        "command": "SELECT",
        "rowCount": 2,
        "oid": null,
        "rows": [
            {
                "id": "ae2f50e9-e199-424e-a0f2-06fdab5f062b",
                "name": "Solar Energy LP",
                "description": "Renewable energy investment liquidity pool",
                "token_symbol": "SOLAR",
                "token_address": "0x1234567890abcdef1234567890abcdef12345678",
                "lp_address": "0xabcdef1234567890abcdef1234567890abcdef12",
                "network": "ethereum",
                "wallet_address": "0x1234567890abcdef1234567890abcdef12345678",
                "status": "active",
                "total_liquidity": "2400000",
                "apy": "12.5",
                "min_investment": "10",
                "max_investment": "100000",
                "created_at": "2025-08-21T21:38:44.508Z",
                "updated_at": "2025-08-21T21:38:44.508Z"
            },
        ]
    },
}

```
```json
404 ERROR

{
    "error": "Route not found"
}
```

## LIQUIDITY POOL BY ID

### DESCRIPTION
GET SPECIFIC LIQUIDITY POOL BY ID

### ENDPOINT
`GET /api/liquidity-pools/:id`


### (JSON) PARAMETERS 
| Parámetro | Tipo   | Requerido | Descripción                            |
| --------- | ------ | --------- | -------------------------------------- |
|   `id`    | string |    yes    | AUTO-GENERATED ID CREATED BY DB SCHEMA |


### EXAMPLE REQUEST
`GET /api/liquidity-pools/ae2f50e9-e199-424e-a0f2-06fdab5f062b`

### POSSIBLE RESULTS

```json
200 OK

{
     "success": true,
    "liquidityPool": {
        "command": "SELECT",
        "rowCount": 1,
        "oid": null,
        "rows": [
            {
                "id": "ae2f50e9-e199-424e-a0f2-06fdab5f062b",
                "name": "Solar Energy LP",
                "description": "Renewable energy investment liquidity pool",
                "token_symbol": "SOLAR",
                "token_address": "0x1234567890abcdef1234567890abcdef12345678",
                "lp_address": "0xabcdef1234567890abcdef1234567890abcdef12",
                "network": "ethereum",
                "wallet_address": "0x1234567890abcdef1234567890abcdef12345678",
                "status": "active",
                "total_liquidity": "2400000",
                "apy": "12.5",
                "min_investment": "10",
                "max_investment": "100000",
                "created_at": "2025-08-21T21:38:44.508Z",
                "updated_at": "2025-08-21T21:38:44.508Z"
            }
        ]
    },
}

```
```json
500 ERROR

{
    "error": "Internal server error"
}
```

## LIQUIDITY POOL METRICS BY ID

### DESCRIPTION
GET SPECIFIC LIQUIDITY POOL METRICS BY POOL ID

### ENDPOINT
`GET /api/liquidity-pools/:id/metrics`


### (JSON) PARAMETERS 
| Parámetro | Tipo   | Requerido | Descripción                            |
| --------- | ------ | --------- | -------------------------------------- |
|   `id`    | string |    yes    | AUTO-GENERATED ID CREATED BY DB SCHEMA |


### EXAMPLE REQUEST
`GET /api/liquidity-pools/ccc393bf-ee53-4d7a-b3f2-40946a09cf41/metrics`

### POSSIBLE RESULTS

```json
200 OK

{
    "success": true,
    "metrics": [
        {
            "id": "85083847-d4a4-47e9-8e65-8e7d31bad39a",
            "lp_id": "ccc393bf-ee53-4d7a-b3f2-40946a09cf41",
            "price_usd": "1.25",
            "market_cap": "5000000",
            "volume_24h": "250000",
            "circulating_supply": "4000000",
            "total_supply": "5000000",
            "price_change_24h": "2.5",
            "volume_change_24h": "10",
            "timestamp": "2025-08-21T16:00:00.000Z"
        }
    ]
}

```
```json
500 ERROR

{
    "error": "Internal server error"
}