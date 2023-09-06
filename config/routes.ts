export default [
  { path: '/user', layout: false, routes: [
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' }
    ] 
  },
  { path: '/', redirect: '/welcome' },
  { path: '/welcome',name: '首页', icon:'contacts', component:'./Welcome' },
  { path: '/add_chart', name: '智能分析(同步)', icon: 'barChart', component: './AddChart' },
  { path: '/add_chart_async', name: '智能分析(异步)', icon: 'barChart', component: './AddChartAsync' },
  { path:'/my_chart', name: '我的图表', icon: 'pieChart', component:'./MyChart'},
  { path: '*', layout: false, component: './404' },
];
