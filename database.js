// Base de dados demo e configuração do fluxo
const storeKey = 'go_bpm_v3';
const memoryStore = {};
const storage = {
  getItem(k){ try { return localStorage.getItem(k); } catch(e) { return memoryStore[k] || null; } },
  setItem(k,v){ try { localStorage.setItem(k,v); } catch(e) { memoryStore[k] = String(v); } },
  removeItem(k){ try { localStorage.removeItem(k); } catch(e) { delete memoryStore[k]; } }
};

const STEPS = [
  {key:'complementar', name:'Complementar Dados', role:'complementador', desc:'Pessoa complementa serviço, centro de custo, observação e anexos.'},
  {key:'validar', name:'Validar Nota', role:'gestor', desc:'Gestor do setor valida se dados e anexo estão corretos.'},
  {key:'assinar', name:'Assinar Nota', role:'diretoria', desc:'Dono/diretor assina ou aprova a nota.'},
  {key:'integrar', name:'Integrar Nota Consinco', role:'fiscal', desc:'Fiscal/integração envia os dados complementados para a Consinco.'},
  {key:'autorizar_pagamento', name:'Autorizar Pagamento', role:'gestor_financeiro', desc:'Gestor financeiro autoriza ou bloqueia pagamento.'},
  {key:'pagar', name:'Pagar', role:'financeiro', desc:'Financeiro realiza o pagamento e anexa comprovante.'},
  {key:'finalizado', name:'Finalizado', role:'consulta', desc:'Processo encerrado com histórico completo.'}
];

const roles = {
  admin:'Administrador', complementador:'Complementar dados', gestor:'Gestor do setor', diretoria:'Diretoria/Assinatura', fiscal:'Fiscal/Consinco', gestor_financeiro:'Gestor financeiro', financeiro:'Financeiro/Pagamento', consulta:'Consulta'
};

function seed(){
  const users = [
    {id:'u1',name:'RENAN LIMA MIRANDA',email:'renan@empresa.com',pass:'123456',role:'admin'},
    {id:'u2',name:'Fiscal Consinco',email:'fiscal@empresa.com',pass:'123456',role:'fiscal'},
    {id:'u3',name:'Gestor Setor',email:'gestor@empresa.com',pass:'123456',role:'gestor'},
    {id:'u4',name:'Diretoria',email:'diretor@empresa.com',pass:'123456',role:'diretoria'},
    {id:'u5',name:'Gestor Financeiro',email:'gestor.financeiro@empresa.com',pass:'123456',role:'gestor_financeiro'},
    {id:'u6',name:'Financeiro',email:'financeiro@empresa.com',pass:'123456',role:'financeiro'}
  ];
  const branches = ['02 FILIAL','03 FILIAL','04 FILIAL','05 FILIAL','06 FILIAL','07 FILIAL','08 FILIAL','11 FILIAL','500 CD'];
  const suppliers = ['GAROA MATERIAIS ELETRICOS LTDA','MORIA COM TINTAS MATERIAIS','JD HELENA RP MATERIAIS CONST','FRIGELAR COMERCIO E INDUSTRIA','CLOVIS MANUT FORNO MAQ PANIF','CASA DO PINTOR COM DISTRIB','WR MATERIAIS ELETRICOS EIRELI','POWER STYLLUS DOOR IND','PERFIMALTA COM DE PERFILADO','PEDRO SOARES ROSARIO'];
  const processes=[];
  const now = new Date('2026-07-02T10:51:27');
  const samples = [
    [8,'08 FILIAL',19162,520,'GAROA MATERIAIS ELETRICOS LTDA','2026-06-24','2026-06-25','2026-06-25','55 - Nota Fiscal Eletrônica, modelo 55','2','35260607109980000104550020000191621000192369.pdf','complementar'],
    [5,'05 FILIAL',8530,500,'CLOVIS MANUT FORNO MAQ PANIF','2026-07-01','2026-07-02','2026-07-02','55 - Nota Fiscal Eletrônica, modelo 55','1','NF8530.pdf','complementar'],
    [7,'07 FILIAL',6564,764.70,'MORIA COM TINTAS MATERIAIS','2026-07-02','2026-07-02','2026-07-02','55 - Nota Fiscal Eletrônica, modelo 55','1','NF6564.pdf','validar'],
    [4,'04 FILIAL',654795,3899.92,'FRIGELAR COMERCIO E INDUSTRIA','2026-07-02','2026-07-02','2026-07-02','55 - Nota Fiscal Eletrônica, modelo 55','3','NF654795.pdf','assinar'],
    [2,'02 FILIAL',2776,2429.40,'ELAINE ALVES PUGA ARAUJO M.E','2026-07-02','2026-07-02','2026-07-02','55 - Nota Fiscal Eletrônica, modelo 55','1','NF2776.pdf','integrar'],
    [8,'08 FILIAL',9500,3630,'PERFIMALTA COM DE PERFILADO','2026-07-02','2026-07-02','2026-07-02','55 - Nota Fiscal Eletrônica, modelo 55','2','NF9500.pdf','autorizar_pagamento'],
    [11,'11 FILIAL',492436,6894.20,'MOHAWK REVESTIMENTOS','2026-06-29','2026-06-30','2026-06-30','55 - Nota Fiscal Eletrônica, modelo 55','4','NF492436.pdf','pagar'],
    [500,'500 CD',4856,780,'PEDRO SOARES ROSARIO','2026-06-22','2026-06-23','2026-06-23','55 - Nota Fiscal Eletrônica, modelo 55','1','NF4856.pdf','finalizado'],
  ];
  let base = 2062400;
  for(const s of samples){
    const step = STEPS.find(x=>x.key===s[12]);
    const opened = new Date(now.getTime() - Math.floor(Math.random()*9)*86400000 - Math.floor(Math.random()*8)*3600000);
    const p = {id:String(base++), code:String(base+3000), type:'Gestão Orçamentária', task:step.name, step:s[12], status:s[12]==='finalizado'?'Finalizado':'Aberto', priority:Number(s[3])>3000?'Alta':'Normal', marker:'Automático', company:'Empresa Principal', branchCode:s[0], branch:s[1], openedAt:opened.toISOString(), taskOpenedAt:opened.toISOString(), dueAt:new Date(opened.getTime()+3*86400000).toISOString(), closedAt:s[12]==='finalizado'?new Date(opened.getTime()+5*86400000).toISOString():null, openedBy:'Fiscal Consinco', closedBy:null, responsibleRole:step.role, invoice:{supplierCode:String(Math.floor(Math.random()*90000)+10000),supplier:s[4],emissionDate:s[5],entryDate:s[6],inclusionDate:s[7],amount:s[3],paymentDays:'30',number:String(s[2]),service:'',costCenter:'',model:s[8],series:s[9],observation:''}, attachments:[{name:s[10],type:'PDF da nota',at:opened.toISOString()}], comments:[], history:[{at:opened.toISOString(),user:'Fiscal Consinco',action:'Processo criado automaticamente pela pasta de entrada/Consinco',detail:`NF ${s[2]} - ${s[4]}`}], integration:{source:'Pasta de entrada',consincoStatus:s[12]==='integrar'?'Pendente integração':(s[12]==='finalizado'?'Integrado':'Aguardando etapa'),consincoId:'',lastSync:null}, payment:{authorized:false,paid:s[12]==='finalizado',paidAt:s[12]==='finalizado'?new Date(opened.getTime()+4*86400000).toISOString():null,receipt:s[12]==='finalizado'?'comprovante.pdf':''}}
    processes.push(p);
  }
  const data = {session:null, users, branches, settings:{nextProcess:2062442, folderName:'Pasta de entrada NF/Consinco', mode:'demo'}, processes};
  storage.setItem(storeKey, JSON.stringify(data));
  return data;
}
let data = JSON.parse(localStorage.getItem(storeKey)||'null') || seed();
function save(){storage.setItem(storeKey, JSON.stringify(data));}
