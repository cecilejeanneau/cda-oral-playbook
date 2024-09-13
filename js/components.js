class LabelFormatter{constructor(e){this.content=e}trim(){return this.content=this.content.trim(),this}escapeHTML(){let e={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","`":"&#96;"};return this.content=this.content.replace(/[&<>"'`]/g,t=>e[t]),this}addNoBreakingSpace(){return this.content=this.content.replace(/(\s)([:;!?])/g,"&nbsp;$2"),this}convertOneTag(e,t){let n=RegExp(`\\[${e}\\]`,"g"),i=RegExp(`\\[\\/${e}\\]`,"g");return this.content=this.content.replace(n,`<span class="${t}">`),this.content=this.content.replace(i,"</span>"),this}convertAllTags(){for(let[e,t]of Object.entries({strong:"strong",italics:"italics",underline:"underline"}))this.convertOneTag(e,t);return this}createParagraphElement(){let e=this.content.startsWith("-")?"p-list":"";return this.content=`<p class="${e}">${this.content}</p>`,this}createCodeElement(e){return this.content=`
    <div class="code-block position-relative rounded" title="Cliquez pour copier" id="code-block-${e}">
        <pre style="background-color:inherit"><code>${this.content}</code></pre>
    </div>`,this}get(){return this.content}}class Accordion{constructor(e,t){this.container=document.getElementById(e),this.jsonUrl=t,this.data=null}async init(){await this.loadJSON(),this.renderAccordion()}async loadJSON(){try{let e=await fetch(this.jsonUrl);this.data=await e.json()}catch(t){console.error("Erreur de chargement du JSON:",t)}}renderAccordion(){this.data&&this.data.sections&&this.data.sections.forEach((e,t)=>{let n=new AccordionSection(e,t);this.container.appendChild(n.renderSection())})}}class AccordionSection{constructor(e,t){this.section=e,this.sectionIndex=t}renderSection(){let e=document.createElement("div");return e.classList.add("mb-4"),e.innerHTML=this.getSectionHTML(),this.populateInnerAccordion(e),e}getSectionHTML(){return`
        <div>
            <h2 class="background accordion-header h2 bg-success p-2 text-white" 
                id="headingSection${this.sectionIndex}" 
                data-bs-toggle="collapse" 
                data-bs-target="#innerAccordion${this.sectionIndex}" 
                aria-expanded="false" 
                aria-controls="innerAccordion${this.sectionIndex}">
                ${this.section.title}
            </h2>
            <div>
                <div class="accordion rounded-bottom collapse" 
                    id="innerAccordion${this.sectionIndex}">
                </div>
            </div>
        </div>
    `}populateInnerAccordion(e){let t=e.querySelector(`#innerAccordion${this.sectionIndex}`);this.section.items.forEach((e,n)=>{let i=new AccordionItem(e,this.sectionIndex,n);t.appendChild(i.renderItem())})}}class AccordionItem{constructor(e,t,n){this.itemData=e,this.sectionIndex=t,this.itemIndex=n}renderItem(){let e=document.createElement("div");e.classList.add("accordion-item");let t=`collapseItem${this.sectionIndex}${this.itemIndex}`,n=this.sanitizeTitle(this.itemData.title);return e.innerHTML=this.getItemHTML(t,n),e}getItemHTML(e,t){return`
        <h3 class="accordion-header" id="headingItem${this.sectionIndex}${this.itemIndex}">
            <button
                class="background accordion-button collapsed bg-success text-dark bg-opacity-50 border" 
                type="button" 
                data-bs-toggle="collapse" 
                data-bs-target="#${e}" 
                aria-expanded="false" 
                aria-controls="${e}">
                ${t}
            </button>
        </h3>
        <div id="${e}" class="accordion-collapse collapse" 
            aria-labelledby="headingItem${this.sectionIndex}${this.itemIndex}" 
            data-bs-parent="#innerAccordion${this.sectionIndex}">
            <div class="background accordion-body bg-success p-2 text-dark bg-opacity-10 pb-3">
                ${this.generateCommandHTML(this.itemData.commands)}
            </div>
        </div>
    `}sanitizeTitle(e){let t=new LabelFormatter(e);return t.trim(),t.escapeHTML(),t.addNoBreakingSpace(),t.get()}generateCommandHTML(e){return e.map((e,t)=>`
            ${e.label?this.sanitizeLabels(e.label):""}
            ${e.code?this.sanitizeCode(e.code,t):""}
        `).join("")}sanitizeCode(e,t){Array.isArray(e)&&(e=e.join("\n"));let n=new LabelFormatter(e);n.escapeHTML(),n.createCodeElement(`${this.sectionIndex}-${t}`);let i=n.get();return i}sanitizeLabels(e){let t=Array.isArray(e)?e:[e],n="";return t.forEach(e=>{let t=new LabelFormatter(e);t.trim(),t.escapeHTML(),t.addNoBreakingSpace(),t.convertAllTags(),t.createParagraphElement(),n+=t.get()}),n}}function createHomeButton(){let e=document.createElement("div");return e.className="home-button-container",e.innerHTML=`
    <a href="../index.html" class="background button-common home-button">
        <i class="bi bi-house-fill"></i>
    </a>
`,e}function createContent(e){let t="";""!==e.image&&(t=`<img src="${e.image}" class="card-img-top" alt="${e.title}">`);let n=document.createElement("div");return n.className="card-body d-flex flex-column mt-5 mb-5",n.innerHTML=`
    <h1 class="text-center mb-4">Documentation ${e.title}</h1>
    ${t}
    <p>${e.description}</p>
    <p>${e.details}</p>
    <p>${e.usage}</p>
`,n}function createContentAccordion(){let e=document.createElement("div");return e.id="accordion-container",e}async function initializeContent(e){let t=document.createElement("div");t.className="container my-5";let n=createHomeButton();t.appendChild(n),await fetch("../json/data.json").then(e=>e.json()).then(n=>{let i=n[e];t.appendChild(createContent(i)),t.appendChild(createContentAccordion()),document.querySelector("body").appendChild(t)}).catch(e=>console.error("Erreur lors du chargement des donn\xe9es:",e));let i=new Accordion("accordion-container",`../json/${e}.json`);i.init()}