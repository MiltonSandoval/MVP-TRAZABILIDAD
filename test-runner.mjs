import assert from "node:assert/strict";

// Mock del servicio de IA para validar algoritmos de riesgo
function evaluarHeuristica(texto, simularFalla = false) {
  if (simularFalla) {
    return {
      nivelRiesgo: "PENDIENTE_CLASIFICACION_MANUAL",
      scoreRiesgo: 0.0,
    };
  }

  const textoLower = texto.toLowerCase();
  const factoresAltos = ["desmonte", "chaqueo", "curichi", "cuenca", "río piraí"];
  const esAlto = factoresAltos.some((f) => textoLower.includes(f));

  if (esAlto) {
    return {
      nivelRiesgo: "ALTO_RIESGO_SOCIOAMBIENTAL",
      scoreRiesgo: 0.94,
    };
  }

  return {
    nivelRiesgo: "BAJO_RIESGO",
    scoreRiesgo: 0.15,
  };
}

function generarCodigo(municipio) {
  const norm = municipio.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const abrev = norm.includes("robore") ? "ROB" : "SCZ";
  return `TRAM-${abrev}-2026-000123`;
}

console.log("=== Ejecutando Suite de Pruebas Unitarias (TDD) ===");

// Prueba 1: Generación de código
console.log("1. Test: Generación de código reglamentario municipal...");
const codigo = generarCodigo("Roboré");
assert.match(codigo, /^TRAM-ROB-2026-\d{6}$/);
console.log("  [PASS] Formato de código verificado:", codigo);

// Prueba 2: Categorización de Alto Riesgo
console.log("2. Test: Motor AI-DLC categoriza desmonte en curichi como Alto Riesgo...");
const resAlto = evaluarHeuristica("Desmonte de 20 hectáreas en curichi y serranía");
assert.equal(resAlto.nivelRiesgo, "ALTO_RIESGO_SOCIOAMBIENTAL");
assert.ok(resAlto.scoreRiesgo >= 0.7);
console.log("  [PASS] Riesgo alto clasificado correctamente.");

// Prueba 3: Manejo de contingencia (Circuit Breaker)
console.log("3. Test: Contingencia AI asigna PENDIENTE_CLASIFICACION_MANUAL ante fallo...");
const resFalla = evaluarHeuristica("Cualquier trámite", true);
assert.equal(resFalla.nivelRiesgo, "PENDIENTE_CLASIFICACION_MANUAL");
console.log("  [PASS] Fallback de contingencia verificado.");

console.log("=== Todas las pruebas unitarias pasaron con éxito ===");
