/**
 * DATWEB SISTEMAS - SIMULADOR INTERATIVO DE EFICIÊNCIA & ROI
 * Permite que promotoras de crédito, comércios e condomínios simulem
 * em tempo real o ganho de produtividade e retorno financeiro.
 */

document.addEventListener('DOMContentLoaded', () => {
  const segmentBtns = document.querySelectorAll('.sim-segment-btn');
  const sliderOperators = document.getElementById('slider-operators');
  const valOperators = document.getElementById('val-operators');
  const sliderVolume = document.getElementById('slider-volume');
  const valVolume = document.getElementById('val-volume');

  // Outputs
  const outHours = document.getElementById('out-hours');
  const outRoi = document.getElementById('out-roi');
  const outAccuracy = document.getElementById('out-accuracy');
  const outConversion = document.getElementById('out-conversion');
  const btnApplySim = document.getElementById('btn-apply-sim');

  if (!sliderOperators || !sliderVolume) return;

  let currentSegment = 'promobank'; // 'promobank', 'lukro', 'vizage'

  const segmentConfigs = {
    promobank: {
      opLabel: 'Operadores de Crédito / Atendentes',
      volLabel: 'Propostas de Crédito / Mês',
      minOp: 1, maxOp: 100, defaultOp: 12,
      minVol: 50, maxVol: 5000, defaultVol: 650,
      volUnit: ' propostas',
      hoursPerOp: 18, // horas manuais economizadas por operador/mês com esteira automatizada
      roiMultiplier: 4.8,
      conversionBoost: '+42%',
      accuracyText: '99.9% Sem Glosa'
    },
    lukro: {
      opLabel: 'Colaboradores / Caixas / Lojas',
      volLabel: 'Vendas & Emissões Fiscais / Mês',
      minOp: 1, maxOp: 50, defaultOp: 6,
      minVol: 200, maxVol: 15000, defaultVol: 1800,
      volUnit: ' notas/vendas',
      hoursPerOp: 14,
      roiMultiplier: 5.2,
      conversionBoost: '+28%',
      accuracyText: '100% Conciliado'
    },
    vizage: {
      opLabel: 'Pontos de Acesso / Portarias',
      volLabel: 'Fluxo Diário de Pessoas / Validações',
      minOp: 1, maxOp: 20, defaultOp: 4,
      minVol: 100, maxVol: 10000, defaultVol: 1200,
      volUnit: ' acessos/dia',
      hoursPerOp: 35,
      roiMultiplier: 6.0,
      conversionBoost: '< 0.3s',
      accuracyText: '99.98% Biometria'
    }
  };

  function updateSimulator() {
    const config = segmentConfigs[currentSegment];
    const ops = parseInt(sliderOperators.value, 10);
    const vol = parseInt(sliderVolume.value, 10);

    valOperators.textContent = ops;
    valVolume.textContent = vol.toLocaleString('pt-BR') + config.volUnit;

    // Calculations
    const savedHoursMonth = Math.round(ops * config.hoursPerOp);
    const estimatedRoi = (config.roiMultiplier * (ops * 0.4 + (vol / 500) * 0.6)).toFixed(1);

    if (outHours) outHours.textContent = savedHoursMonth.toLocaleString('pt-BR') + 'h';
    if (outRoi) outRoi.textContent = estimatedRoi + 'x';
    if (outAccuracy) outAccuracy.textContent = config.accuracyText;
    if (outConversion) outConversion.textContent = config.conversionBoost;
  }

  // Segment toggle
  segmentBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      segmentBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentSegment = btn.getAttribute('data-segment');

      const config = segmentConfigs[currentSegment];
      document.getElementById('label-operators-title').textContent = config.opLabel;
      document.getElementById('label-volume-title').textContent = config.volLabel;

      sliderOperators.min = config.minOp;
      sliderOperators.max = config.maxOp;
      sliderOperators.value = config.defaultOp;

      sliderVolume.min = config.minVol;
      sliderVolume.max = config.maxVol;
      sliderVolume.value = config.defaultVol;

      updateSimulator();
    });
  });

  sliderOperators.addEventListener('input', updateSimulator);
  sliderVolume.addEventListener('input', updateSimulator);

  // Initial calculation
  updateSimulator();

  // Transfer simulation values to contact form
  if (btnApplySim) {
    btnApplySim.addEventListener('click', (e) => {
      e.preventDefault();
      const contactSection = document.getElementById('contato');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        const selectProd = document.getElementById('form-produto');
        if (selectProd) {
          if (currentSegment === 'promobank') selectProd.value = 'PromoBank';
          else if (currentSegment === 'lukro') selectProd.value = 'Lukro';
          else if (currentSegment === 'vizage') selectProd.value = 'Vizage';
        }
        const msgField = document.getElementById('form-mensagem');
        if (msgField) {
          msgField.value = `Tenho interesse na solução ${currentSegment === 'promobank' ? 'PromoBank' : currentSegment === 'lukro' ? 'Lukro ERP' : 'Vizage Facial'}. Minha simulação considera ${sliderOperators.value} operadores/pontos e volume de ${sliderVolume.value}. Gostaria de conhecer a solução.`;
        }
      }
    });
  }
});
