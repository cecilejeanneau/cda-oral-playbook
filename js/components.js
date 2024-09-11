function escapeHTML(e){let t={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","`":"&#96;"};return e.replace(/[&<>"'`]/g,e=>t[e])}class Accordion{constructor(e,t){this.container=document.getElementById(e),this.jsonUrl=t,this.data=null,this.commandCounter=0}async init(){await this.loadJSON(),this.renderSections()}async loadJSON(){try{let e=await fetch(this.jsonUrl);this.data=await e.json()}catch(t){console.error("Erreur de chargement du JSON:",t)}}renderSections(){this.data&&this.data.sections&&(this.data.sections.forEach((e,t)=>{console.log(this.container),this.container.appendChild(this.createSection(e,t))}),this.addCopyHandlers())}createSection(e,t){let a=document.createElement("div");a.classList.add("mb-4"),a.innerHTML=`
    <div>
        <h2 class="background accordion-header h2 bg-success p-2 text-white" id="headingSection${t}" data-bs-toggle="collapse" data-bs-target="#innerAccordion${t}" aria-expanded="false" aria-controls="innerAccordion${t}">
            ${e.title}
        </h2>
        <div> 
            <div class="accordion rounded-bottom collapse" id="innerAccordion${t}">
            </div>
        </div>
    </div>`;let o=a.querySelector(`#innerAccordion${t}`);return e.items.forEach((e,a)=>{o.appendChild(this.createItem(e,t,a))}),a}createItem(e,t,a){let o=document.createElement("div");o.classList.add("accordion-item");let n=`collapseItem${t}${a}`,r=`
    <h2 class="accordion-header" id="headingItem${t}${a}">
        <button class="background accordion-button collapsed bg-success text-dark bg-opacity-50 border" type="button" data-bs-toggle="collapse" data-bs-target="#${n}" aria-expanded="false" aria-controls="${n}">
            ${e.title}
        </button>
    </h2>
    <div id="${n}" class="accordion-collapse collapse" aria-labelledby="headingItem${t}${a}" data-bs-parent="#innerAccordion${t}">
        <div class="background accordion-body bg-success p-2 text-dark bg-opacity-10 pb-3">
            ${this.createCommands(e.commands)}
        </div>
    </div>`;return o.innerHTML=r,o}createCommands(e){this.commandCounter+=1;let t=this.commandCounter;return e.map((e,a)=>(Array.isArray(e.code)?e.code.join("\n"):e.code,`
            ${e.label?this.formatLabels(e.label):""}
            ${e.code?this.formatCode(e.code,t,a):""}
        `)).join("")}formatCode(e,t,a){return`
    <div class="code-block position-relative rounded" title="Cliquez pour copier" id="code-block-${t}-${a}">
        <pre style="background-color:inherit"><code>${escapeHTML(e)}</code></pre>
    </div>
`}formatLabels(e){let t=e=>e.replace(/\[strong\]/g,"<strong>").replace(/\[\/strong\]/g,"</strong>");if(Array.isArray(e))return e.map(e=>{let a=escapeHTML(e),o=e.trim().startsWith("-")?"p-list":"";return`<p class="${o}">${t(a)}</p>`}).join("");{let a=escapeHTML(e);return`<p>${t(a)}</p>`}}addCopyHandlers(){document.querySelectorAll(".code-block").forEach(e=>{e.addEventListener("click",()=>{let t=e.querySelector("code"),a=t.innerText||t.textContent;navigator.clipboard.writeText(a).then(()=>{e.classList.add("pressed"),e.setAttribute("title","Cliquez pour copier"),setTimeout(()=>{e.classList.remove("pressed")},200)}).catch(e=>{console.error("\xc9chec de la copie: ",e)})})})}}function createHomeButton(){let e=document.createElement("div");return e.className="home-button-container",e.innerHTML=`
<a href="../index.html" class="background button-common home-button">
    <i class="bi bi-house-fill"></i>
</a>
`,e}function createContent(e){let t="";""!==e.image&&(t=`<img src="${e.image}" class="card-img-top" alt="${e.title}">`);let a=document.createElement("div");return a.className="card-body d-flex flex-column mt-5 mb-5",a.innerHTML=`
<h1 class="text-center mb-4">Documentation ${e.title}</h1>
${t}
<p>${e.description}</p>
<p>${e.details}</p>
<p>${e.usage}</p>
`,a}function createColorButton(){let e=document.createElement("div");return e.className="color-changer-container",e}function createContentAccordion(){let e=document.createElement("div");return e.id="accordion-container",e}async function initializeContent(e){let t=document.createElement("div");t.className="container my-5";let a=createHomeButton(),o=createColorButton();t.appendChild(a),t.appendChild(o),await fetch("../json/data.json").then(e=>e.json()).then(a=>{let o=a[e];console.log(o),t.appendChild(createContent(o)),t.appendChild(createContentAccordion()),document.querySelector("body").appendChild(t)}).catch(e=>console.error("Erreur lors du chargement des donn\xe9es:",e));let n=new Accordion("accordion-container",`../json/${e}.json`);n.init()}