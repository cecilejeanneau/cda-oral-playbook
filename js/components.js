function escapeHTML(html) {
    const escapeMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
        "`": "&#96;",
    };
    return html.replace(/[&<>"'`]/g, (match) => escapeMap[match]);
}
class Accordion {
    constructor(containerId, jsonUrl) {
        this.container = document.getElementById(containerId);
        this.jsonUrl = jsonUrl;
        this.data = null;
        this.commandCounter = 0;
    }
    async init() {
        await this.loadJSON();
        this.renderSections();
    }
    async loadJSON() {
        try {
            const response = await fetch(this.jsonUrl);
            this.data = await response.json();
        } catch (error) {
            console.error("Erreur de chargement du JSON:", error);
        }
    }
    renderSections() {
        if (!this.data || !this.data.sections) return;
        this.data.sections.forEach((section, sectionIndex) => {
            this.container.appendChild(this.createSection(section, sectionIndex));
        });
        this.addCopyHandlers();
    }
    createSection(section, sectionIndex) {
        const sectionDiv = document.createElement("div");
        sectionDiv.classList.add("mb-4");
        sectionDiv.innerHTML = `
            <div>
                <h2 class="background accordion-header h2 bg-success p-2 text-white" id="headingSection${sectionIndex}" data-bs-toggle="collapse" data-bs-target="#innerAccordion${sectionIndex}" aria-expanded="false" aria-controls="innerAccordion${sectionIndex}">
                    ${section.title}
                </h2>
                <div> 
                    <div class="accordion rounded-bottom collapse" id="innerAccordion${sectionIndex}">
                    </div>
                </div>
            </div>`;
        const innerAccordion = sectionDiv.querySelector(
            `#innerAccordion${sectionIndex}`
        );
        section.items.forEach((item, itemIndex) => {
            innerAccordion.appendChild(
                this.createItem(item, sectionIndex, itemIndex)
            );
        });
        return sectionDiv;
    }
    createItem(item, sectionIndex, itemIndex) {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("accordion-item");
        const itemId = `collapseItem${sectionIndex}${itemIndex}`;
        const itemHeader = `
            <h2 class="accordion-header" id="headingItem${sectionIndex}${itemIndex}">
                <button class="background accordion-button collapsed bg-success text-dark bg-opacity-50 border" type="button" data-bs-toggle="collapse" data-bs-target="#${itemId}" aria-expanded="false" aria-controls="${itemId}">
                    ${item.title}
                </button>
            </h2>
            <div id="${itemId}" class="accordion-collapse collapse" aria-labelledby="headingItem${sectionIndex}${itemIndex}" data-bs-parent="#innerAccordion${sectionIndex}">
                <div class="background accordion-body bg-success p-2 text-dark bg-opacity-10 pb-3">
                    ${this.createCommands(item.commands)}
                </div>
            </div>`;
        itemDiv.innerHTML = itemHeader;
        return itemDiv;
    }
    createCommands(commands) {
        this.commandCounter += 1;
        const counter = this.commandCounter;
        return commands
            .map((command, index) => {
                let transformedCode = Array.isArray(command.code)
                    ? command.code.join("\n")
                    : command.code;
                return `
                ${command.label ? `<p>${escapeHTML(command.label)}</p>` : ""}
                ${transformedCode
                        ? `<div class="code-block position-relative rounded" title="Cliquez pour copier" id="code-block-${counter}-${index}"><pre style="background-color:inherit"><code>${escapeHTML(
                            transformedCode
                        )}</code></pre></div>`
                        : ""
                    }
            `;
            })
            .join("");
    }
    addCopyHandlers() {
        document.querySelectorAll(".code-block").forEach((block) => {
            block.addEventListener("click", () => {
                const codeBlock = block.querySelector("code");
                const text = codeBlock.innerText || codeBlock.textContent;
                navigator.clipboard
                    .writeText(text)
                    .then(() => {
                        block.classList.add("pressed");
                        block.setAttribute("title", "Cliquez pour copier");
                        setTimeout(() => {
                            block.classList.remove("pressed");
                        }, 200);
                    })
                    .catch((err) => {
                        console.error("Échec de la copie: ", err);
                    });
            });
        });
    }
}

// Fonction pour créer le bouton d'accueil
function createHomeButton() {
    const homeButtonContainer = document.createElement("div");
    homeButtonContainer.className = "home-button-container";
    homeButtonContainer.innerHTML = `
        <a href="https://pharallaxe.github.io/doc_public/" class="background button-common home-button">
            <i class="bi bi-house-fill"></i>
        </a>
    `;
    return homeButtonContainer;
}

// Fonction pour créer le contenu en fonction du framework
function createContent(data) {
    let img = "";
    if (data.image !== "") img = `<img src="${data.image}" class="card-img-top" alt="${data.title}">`

    const contentDiv = document.createElement("div");
    contentDiv.className = "card-body d-flex flex-column mt-5 mb-5";
    contentDiv.innerHTML = `
        <h1 class="text-center mb-4">Documentation ${data.title}</h1>
        ${img}
        <p>${data.description}</p>
        <p>${data.details}</p>
        <p>${data.usage}</p>
    `;
    return contentDiv;
}

function createContentAccordion() {
    const contentAccordion = document.createElement("div");
    contentAccordion.id = "accordion-container";
    return contentAccordion;
}

// Fonction principale pour initialiser le contenu
async function initializeContent(techno) {
    const contentContainer = document.createElement("div");
    contentContainer.className = "container my-5";

    const homeButton = createHomeButton();
    contentContainer.appendChild(homeButton);

    await fetch("../json/_data.json")
    await fetch("../json/data.json")
        .then((response) => response.json())
        .then((data) => {
            const selectedData = data[techno];
            contentContainer.appendChild(createContent(selectedData));
            contentContainer.appendChild(createContentAccordion());
            document.querySelector("body").appendChild(contentContainer);

        })
        .catch((error) =>
            console.error("Erreur lors du chargement des données:", error)
        );

    const accordion = new Accordion(
        "accordion-container",
        `../json/${techno}.min.json`
    );
    accordion.init();
}