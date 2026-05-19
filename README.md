# Investment Tracker

Webapp para registrar el avance de inversiones en Quanfury, Hapi, Binance y Tyba (2023–2027).

## Uso

Abrí `index.html` directamente en el navegador. No requiere servidor ni dependencias.

## Funcionalidades

- Tabla con registros agrupados por plataforma
- Gráfico de líneas comparativo (Canvas)
- Depósitos registrados por año
- ROI calculado considerando valor inicial + depósitos
- Agregar / editar / eliminar inversiones
- Persistencia en localStorage

## Tech

- HTML5 + CSS3 + JavaScript vanilla
- Canvas API para gráficos (sin librerías)

## Modelo de Datos

```javascript
{
  id: timestamp,
  platform: "Quanfury" | "Hapi" | "Binance" | "Tyba",
  year: 2023-2027,
  value: number,        // USD actual
  deposit: number       // capital inyectado ese año
}
```

## Cálculo de ROI

### Por fila (por año):
```
ROI = (valor_actual - valor_anterior - deposito) / (valor_anterior + deposito)
```

### En header de plataforma:
```
total_invertido = valor_inicial + suma_de_depositos
ROI = (valor_final - total_invertido) / total_invertido
```

Ejemplo: Binance con valor inicial $400, depósito $100 en 2026, valor final $745
- total_invertido = 400 + 100 = 500
- ROI = (745 - 500) / 500 = +49%

## Diseño

- Dark theme estilo fintech (#0f0f1a fondo, acentos en azul/verde)
- Responsive (funciona en mobile y desktop)
- Tipografía: system fonts (sans-serif)

## Estructura

```
/investment-tracker/
  index.html    ← archivo único con todo inline
  README.md
  .gitignore
```