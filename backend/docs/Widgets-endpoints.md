# API/ WIDGETS

## ALL WIDGETS

### DESCRIPTION
GET ALL CREATED WIDGETS

### ENDPOINT
`GET /api/widgets`


### (JSON) PARAMETERS 
NONE

### EXAMPLE REQUEST
`GET /api/widgets`

### POSSIBLE RESULTS

```json
200 OK

{
    "success": true,
    "widgets": {
        "command": "SELECT",
        "rowCount": 2,
        "oid": null,
        "rows": [
            {
                "hash": "dob-solar001-abc123",
                "token_id": "SOL",
                "project_id": "project-001",
                "lp_id": "94d5ce64-151e-4121-a3f3-f1290a771ba7",
                "theme": "light",
                "position": "bottom-right",
                "custom_styles": {
                    "color": "#000000",
                    "backgroundColor": "#ffffff"
                },
                "is_active": true,
                "created_at": "2025-08-21T04:00:00.000Z",
                "updated_at": "2025-08-21T04:00:00.000Z"
            },
        ]
    }
}

```
```json
404 ERROR

{
    "error": "Route not found"
}
```
```json
500

{
    "error": "Internal server error"
}
```
## WIDGETS BY HASH

### DESCRIPTION
GET SPECIFIC WIDGET BY HASH

### ENDPOINT
`GET /api/widgets/:hash`


### (JSON) PARAMETERS 
| Parámetro   | Tipo   | Requerido | Descripción                            |
| ----------- | ------ | --------- | -------------------------------------- |
|   `hash`    | string |    yes    | AUTO-GENERATED ID CREATED BY DB SCHEMA |


### EXAMPLE REQUEST
`GET /api/widgets/:hash`

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
                "id": "94d5ce64-151e-4121-a3f3-f1290a771ba7",
                "name": "Solar Energy LP",
                "description": "Renewable energy investment liquidity pool",
                "token_symbol": "SOL",
                "token_address": "12345678-90ab-cdef-1234-567890abcdef",
                "lp_address": "abcdef12-3456-7890-abcd-ef1234567890",
                "network": "ethereum",
                "lp_type": null,
                "wallet_address": "12345678-90ab-cdef-1234-567890abcdef",
                "status": "active",
                "total_liquidity": "2400000",
                "apy": "12.5",
                "min_investment": "10",
                "max_investment": "100000",
                "created_at": "2025-08-21T04:00:00.000Z",
                "updated_at": "2025-08-21T04:00:00.000Z"
            }
        ],
    }
}

```
```json
404 NO FOUND

{
    "error": "Widget not found"
}
```
```json
500 ERROR

{
    "error": "Internal server error"
}