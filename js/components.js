class LabelFormatter{constructor(content){this.content=content;}
trim(){this.content=this.content.trim();return this;}
escapeHTML(){const escapeMap={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","`":"&#96;",};this.content=this.content.replace(/[&<>"'`]/g,(match)=>escapeMap[match]);return this;}
addNoBreakingSpace(){this.content=this.content.replace(/(\s)([:;!?])/g,'&nbsp;$2');return this;}
convertOneTag(tag,className){const openTag=new RegExp(`\\[${tag}\\]`,'g');const closeTag=new RegExp(`\\[\\/${tag}\\]`,'g');this.content=this.content.replace(openTag,`<span class="${className}">`);this.content=this.content.replace(closeTag,'</span>');return this;}
convertAllTags(){const tags={strong:'strong',italics:'italics',underline:'underline'};for(const[key,value]of Object.entries(tags)){this.convertOneTag(key,value);}
return this;}
createParagraphElement(){const className=this.content.startsWith("-")?"p-list":"";this.content=`<p class="${className}">${this.content}</p>`;return this;}
createCodeElement(suffixeId){this.content=`<div class="code-block position-relative rounded"title="Cliquez pour copier"id="code-block-${suffixeId}"><pre style="background-color:inherit"><code>${this.content}</code></pre></div>`;return this;}
get(){return this.content;}}
class Accordion{constructor(containerId,jsonUrl){this.container=document.getElementById(containerId);this.jsonUrl=jsonUrl;this.data=null;}
async init(){await this.loadJSON();this.renderAccordion();}
async loadJSON(){try{const response=await fetch(this.jsonUrl);this.data=await response.json();}catch(error){console.error("Erreur de chargement du JSON:",error);}}
renderAccordion(){if(!this.data||!this.data.sections)return;this.data.sections.forEach((section,index)=>{const sectionComponent=new AccordionSection(section,index);this.container.appendChild(sectionComponent.renderSection());});}}
class AccordionSection{constructor(section,sectionIndex){this.section=section;this.sectionIndex=sectionIndex;}
renderSection(){const sectionDiv=document.createElement("div");sectionDiv.classList.add("mb-4");sectionDiv.innerHTML=this.getSectionHTML();this.populateInnerAccordion(sectionDiv);return sectionDiv;}
getSectionHTML(){return`<div><h2 class="background accordion-header h2 bg-success p-2 text-white"
id="headingSection${this.sectionIndex}"
data-bs-toggle="collapse"
data-bs-target="#innerAccordion${this.sectionIndex}"
aria-expanded="false"
aria-controls="innerAccordion${this.sectionIndex}">${this.section.title}</h2><div><div class="accordion rounded-bottom collapse"
id="innerAccordion${this.sectionIndex}"></div></div></div>`;}
populateInnerAccordion(sectionDiv){const innerAccordion=sectionDiv.querySelector(`#innerAccordion${this.sectionIndex}`);this.section.items.forEach((item,itemIndex)=>{const itemComponent=new AccordionItem(item,this.sectionIndex,itemIndex);innerAccordion.appendChild(itemComponent.renderItem());});}}
class AccordionItem{constructor(itemData,sectionIndex,itemIndex){this.itemData=itemData;this.sectionIndex=sectionIndex;this.itemIndex=itemIndex;}
renderItem(){const itemContainer=document.createElement("div");itemContainer.classList.add("accordion-item");const collapseId=`collapseItem${this.sectionIndex}${this.itemIndex}`;const sanitizedTitle=this.sanitizeTitle(this.itemData.title);itemContainer.innerHTML=this.getItemHTML(collapseId,sanitizedTitle);return itemContainer;}
getItemHTML(collapseId,sanitizedTitle){return`<h3 class="accordion-header"id="headingItem${this.sectionIndex}${this.itemIndex}"><button
class="background accordion-button collapsed bg-success text-dark bg-opacity-50 border"
type="button"
data-bs-toggle="collapse"
data-bs-target="#${collapseId}"
aria-expanded="false"
aria-controls="${collapseId}">${sanitizedTitle}</button></h3><div id="${collapseId}"class="accordion-collapse collapse"
aria-labelledby="headingItem${this.sectionIndex}${this.itemIndex}"
id="#innerAccordion${this.sectionIndex}"><div class="background accordion-body bg-success p-2 text-dark bg-opacity-10 pb-3">${this.generateCommandHTML(this.itemData.commands)}</div></div>`;}
sanitizeTitle(title){const labelledTitleFormatter=new LabelFormatter(title);labelledTitleFormatter.trim();labelledTitleFormatter.escapeHTML();labelledTitleFormatter.addNoBreakingSpace();return labelledTitleFormatter.get();}
generateCommandHTML(commands){return commands.map((command,commandIndex)=>{return`${command.label?this.sanitizeLabels(command.label):""}
${command.code?this.sanitizeCode(command.code,commandIndex):""}`;}).join("");}
sanitizeCode(code,commandIndex){if(Array.isArray(code)){code=code.join('\n');}
const labelledCodeFormatter=new LabelFormatter(code);labelledCodeFormatter.escapeHTML();labelledCodeFormatter.createCodeElement(`${this.sectionIndex}-${commandIndex}`);const sanitizedCode=labelledCodeFormatter.get();return sanitizedCode;}
sanitizeLabels(label){const labelArray=Array.isArray(label)?label:[label];let formattedLabelsHTML="";labelArray.forEach(labelItem=>{const labelledItemFormatter=new LabelFormatter(labelItem);labelledItemFormatter.trim();labelledItemFormatter.escapeHTML();labelledItemFormatter.addNoBreakingSpace();labelledItemFormatter.convertAllTags();labelledItemFormatter.createParagraphElement();formattedLabelsHTML+=labelledItemFormatter.get();});return formattedLabelsHTML;}}
function createHomeButton(){const homeButtonContainer=document.createElement("div");homeButtonContainer.className="home-button-container";homeButtonContainer.innerHTML=`<a href="../index.html"class="background button-common home-button"><i class="bi bi-house-fill"></i></a>`;return homeButtonContainer;}
function createGroupButton(){const homeButtonContainer=document.createElement("div");homeButtonContainer.className="group-button-container";homeButtonContainer.innerHTML=`<button class="background button-common group-button"id="all-close"><i class="bi bi-arrows-collapse"></i></button>`;return homeButtonContainer;}
function createContent(data){let img="";if(data.image!==""){img=`<img src="${data.image}"class="card-img-top"alt="${data.title}">`}
const contentDiv=document.createElement("div");contentDiv.className="card-body d-flex flex-column mt-5 mb-5";contentDiv.innerHTML=`<h1 class="text-center mb-4">Documentation ${data.title}</h1>${img}<p>${data.description}</p><p>${data.details}</p><p>${data.usage}</p>`;return contentDiv;}
function createContentAccordion(){const contentAccordion=document.createElement("div");contentAccordion.id="accordion-container";return contentAccordion;}
function initializeClose(){const closeButton=document.getElementById('all-close');if(!closeButton){console.warn("Le bouton 'all-close' n'a pas été trouvé.");return;}
closeButton.addEventListener('click',()=>{const openItems=document.querySelectorAll('.accordion-collapse.show');openItems.forEach(item=>{const collapse=bootstrap.Collapse.getInstance(item);if(collapse){collapse.hide();}else{console.warn("Instance Collapse non trouvée pour l'élément",item);}});});}
async function initializeContent(techno){const contentContainer=document.createElement("div");contentContainer.className="container my-5";const homeButton=createHomeButton();const groupButton=createGroupButton();contentContainer.appendChild(homeButton);contentContainer.appendChild(groupButton);await fetch("../json/data.json").then((response)=>response.json()).then((data)=>{const selectedData=data[techno];contentContainer.appendChild(createContent(selectedData));contentContainer.appendChild(createContentAccordion());document.querySelector("body").appendChild(contentContainer);}).catch((error)=>console.error("Erreur lors du chargement des données:",error));const accordion=new Accordion("accordion-container",`../json/${techno}.json`);accordion.init();initializeClose();}