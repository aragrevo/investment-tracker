# Investment Tracker

Webapp para registrar el avance de inversiones en Quanfury, Hapi, Binance y Tyba (2023–2027).

## Uso

Abrí `index.html` directamente en el navegador. No requiere servidor ni dependencias.

## Funcionalidades

- Tabla con registros y % de crecimiento
- Gráfico de líneas comparativo
- Agregar / editar / eliminar inversiones
- Persistencia en localStorage

## Tech

- HTML5 + CSS3 + JavaScript vanilla
- Canvas API para gráficos (sin librerías)

## Plan Detallado

### Estructura del proyecto
```
/investment-tracker/
  index.html    ← archivo único con todo inline
```

### Data Model
```javascript
{
  id: timestamp,
  platform: "Quanfury" | "Hapi" | "Binance" | "Tyba",
  year: 2023-2027,
  value: number,        // USD actual
  growthPercent: number // % de crecimiento vs año anterior
}
```

### Features
| Feature | Detalle |
|---------|---------|
| Ver tabla | Plataformas × Años con valores y % crecimiento |
| Gráfico líneas | 4 colores, leyenda, dots en puntos de datos |
| Agregar | Modal con select platform, año, valor |
| Editar | Click en fila → abre modal precargado |
| Eliminar | Botón por fila con confirmación |
| Persistencia | LocalStorage auto-guarda |
| Responsive | Funciona en mobile |

### Diseño
- Dark theme estilo fintech (#0f0f1a fondo, acentos en azul/verde)
- Responsive (funciona en mobile y desktop)
- Tipografía: system fonts (sans-serif)

### Datos precargados
```
Quanfury:  2023=$112, 2024=$850, 2025=$2200, 2026=$3100, 2027=$2800
Hapi:      2023=$0,   2024=$120, 2025=$450,  2026=$822,  2027=$750
Binance:   2023=$0,   2024=$50,  2025=$280,  2026=$580,  2027=$645
Tyba:      2023=$0,   2024=$100, 2025=$400,  2026=$750,  2027=$831
```

### Flujo UX
1. Usuario ve tabla + gráfico al entrar
2. Botón "Agregar" abre form modal
3. Completa plataforma, año, valor → sistema calcula crecimiento automáticamente
4. Cambios se guardan en localStorage al instante
5. Gráfico se actualiza en tiempo real