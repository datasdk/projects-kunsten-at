var i=(s,n,f)=>typeof f=="function"?f(s,n):typeof f=="string"?s[f]===n[f]:Array.isArray(n)?n.includes(s):s===n,t=(s,n,f)=>s===void 0?!1:Array.isArray(s)?s.some(y=>i(y,n,f)):i(s,n,f);export{i as a,t as b};
/**i18n:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855*/
