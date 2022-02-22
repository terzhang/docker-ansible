import { Forms } from "./index.js";
import {createElement/* , createFragment */} from "./types.js";

function getFieldsetInputs<T>(fieldset: HTMLFieldSetElement, filters?: string[]) {
    const fieldValues = {} as {[key: string]: any};
    const inputCollection = fieldset.elements as HTMLCollectionOf<HTMLInputElement & T>
    for (let input of inputCollection) {
        if (filters){
            if (filters.includes(input.name)) fieldValues[input.name] = input.value
        } else {
            fieldValues[input.name] = input.value
        }
    }
    return fieldValues;
}

// function getFormInputs<T extends {[key: string]: T[string]}>(formName: string, filters?: (Extract<keyof T, string>)[]) {
//     const fieldsets = document.forms.namedItem(formName as string)?.children as HTMLCollectionOf<HTMLFieldSetElement & T>;
//     if (!fieldsets) return null;
    
//     const fieldValues = [];
//     for (let fieldset of fieldsets) {
//         const inputValues = getFieldsetInputs<T>(fieldset, filters)
//         fieldValues.push(inputValues);
//     }
// }

const Consumer = () => {
    const consumer = (
        <form id="consumer-info" class="consumer-info">
            <div class="button-group" id="button-group">
                <button id="resetButton" type="button">Reset</button>
                <button id="addButton" type="button" >+</button>
                <button id="deleteButton" type="button" >-</button>
            </div>
            <fieldset name="consumer-fieldset" id="consumer-fieldset">
                <legend>Consumer Informations</legend>
                <label for="consumer_app">Application</label>
                <input type="text" id="consumer_app" name="consumerApp" required minlength="3" size="40"/>
                <br />

                <label for="consumer_alias">Alias</label>
                <input type="text" id="consumer_alias" name="consumerAlias" required minlength="2" size="20"/>
                <br />

                <label for="consumer_org">Organization</label>
                <input type="text" id="consumer_org" name="consumerOrg" required minlength="2" size="40"/>
                <br />

                <label for="apic_space">APIC Space</label>
                <input type="text" id="apic_space" name="apicSpace" minlength="1" size="10"/>
            </fieldset>
            <ul name="deploy-vars" id="deploy-vars" class="deploy-vars">
                <Vars />
            </ul>
        </form>
    ) as HTMLElement
    const buttonGroup = consumer.children.namedItem("button-group")?.children as HTMLCollectionOf<HTMLButtonElement>
    const resetButton = buttonGroup.namedItem("resetButton") as HTMLButtonElement
    const addButton = buttonGroup.namedItem("addButton") as HTMLButtonElement
    const deleteButton = buttonGroup.namedItem("deleteButton") as HTMLButtonElement
    resetButton.onclick = (e) => {
        e.preventDefault();
        const resetButton = e.target as EventTarget & HTMLButtonElement & {form: HTMLFormElement} | null
        resetButton?.form.reset();
    }
    addButton.onclick = (e) => {
        e.preventDefault();
        // get main #forms element and add a new consumer form.
        const mainForm = document.getElementById("forms") as HTMLDivElement
        mainForm.appendChild(<Consumer /> as Node);
        // const addButton = e.target as EventTarget & HTMLButtonElement & {form: HTMLFormElement} | null
        // addButton?.form.remove()
    }
    deleteButton.onclick = (e) => {
        e.preventDefault();
        const deleteButton = e.target as EventTarget & HTMLButtonElement & {form: HTMLFormElement} | null
        deleteButton?.form.remove()
    }
    return consumer as Element
}

enum ProductInput {
    apiName = 'apiName',
    bianDomain = 'bianDomain',
    basePath = 'basePath',
    targetUrl = 'targetUrl',
    definitionFile = 'definitionFile'
}
type Product = {
    [key in ProductInput]: string
}

const getVars = (vars: Element | HTMLElement): Product[]  => {
    const listItems = vars.children as HTMLCollectionOf<HTMLLIElement>
    const product = [] as Product[];
    for (let varItem of listItems) {
        // construct product from varItem inputs
        const varInputs = getFieldsetInputs(varItem.firstElementChild as HTMLFieldSetElement)
        product.push(varInputs as Product);
    }
    return product;
}

type Consumer = {
    consumer_app: string,
    consumer_alias: string,
    consumer_org: string,
    apic_space?: string,
    products: Product[]
}
const getConsumers = (): Consumer[] => { 
    const consumers = [] as Consumer[];
    // every consumer form
    const consumerList = document.getElementsByClassName(Forms.consumerInfo) as HTMLCollectionOf<HTMLFormElement>;
    for (let consumer of consumerList) {
        // set consumer object
        const fieldset = consumer.children.namedItem(Forms.consumerInfo) as HTMLFieldSetElement;
        const consumerObj = getFieldsetInputs<Consumer>(fieldset)
        
        // get and set consumer products into object
        const vars = consumer.children.namedItem(Forms.deploymentVars) as HTMLFieldSetElement
        if (vars) {
            consumerObj["products"] = getVars(vars);
        }

        // add consumer product to consumers list
        consumers.push(consumerObj as Consumer)
    }
    return consumers
}
// button submit callback
const buildGen = document.getElementById('buildGen') as HTMLInputElement;
const getAllInputs = () => ({
    global: "",
    consumers: getConsumers()
})

buildGen.onclick = () => {
    alert(JSON.stringify(getAllInputs()))
}

const buildPub = document.getElementById('buildPub') as HTMLInputElement;
buildPub.onclick = () => {
    alert(JSON.stringify(getAllInputs()))
}

const buildPubSub = document.getElementById('buildPubSub') as HTMLInputElement;
buildPubSub.onclick = () => {
    alert(JSON.stringify(getAllInputs()))
}

const Vars = () => {
    const vars = (
        <li>
            <div class="button-group" id="button-group">
                <button id="resetButton" type="button">Reset</button>
                <button id="addButton" type="button" >+</button>
                <button id="deleteButton" type="button" >-</button>
            </div>
            <fieldset name="vars0">
                <legend>Deployment Variables</legend>
                <label for="api_name">API Name</label>
                <input type="text" id="api_name" name="apiName" required minlength="3" size="30"/>
                <br />

                <label for="bian_domain">BIAN Domain</label>
                <input type="text" id="bian_domain" name="bianDomain" required minlength="3" size="30"/>
                <br />

                <label for="base_path">Base Path</label>
                <input type="text" id="base_path" name="basePath" required minlength="3" size="40"/>
                <br />

                <label for="target_url">Target URL</label>
                <input type="text" id="target_url" name="targetURL" required minlength="3" size="60"/>
                <br />

                <label for="def_file">Definition File</label>
                <input type="text" id="def_file" name="defFile" required minlength="3" size="60"/>
            </fieldset>
        </li>
    ) as HTMLLIElement
    const buttonGroup = vars.children.namedItem("button-group")?.children as HTMLCollectionOf<HTMLButtonElement>
    const resetButton = buttonGroup.namedItem("resetButton") as HTMLButtonElement
    const addButton = buttonGroup.namedItem("addButton") as HTMLButtonElement
    const deleteButton = buttonGroup.namedItem("deleteButton") as HTMLButtonElement
    resetButton.onclick = (e) => {
        e.preventDefault();
        const resetButton = e.target as EventTarget & HTMLButtonElement & {form: HTMLFormElement} | null
        resetButton?.form.reset();
    }
    addButton.onclick = (e) => {
        e.preventDefault();
        // add itself to its parent
        vars.parentElement?.appendChild(<Vars /> as Node)
    }
    deleteButton.onclick = (e) => {
        e.preventDefault();
        // delete itself if its parent has more than 1 children left 
        vars.parentElement && vars.parentElement?.childElementCount > 1 && vars.remove();
    }
    return vars as Element
}

const Settings = () => (
    <form id="apic-settings">
        <div class="button-group">
            <button id="resetButton" type="button">Reset</button>
        </div>
        <fieldset name="fields" id="setting-fieldset">
            <legend>APIC Settings</legend>
            <label for="apic-server">Server</label>
            <input list="server-options" id="apic-server" name="apicServer" value="server1" />
            <datalist id="server-options">
                <option value="server1"/>
            </datalist>
            <br />
            <label for="apic-realm">Realm</label>
            <input list="realm-options" id="apic-realm" name="apicRealm" value="realm1" />
            <datalist id="realm-options">
                <option value="realm1"/>
            </datalist>
            <br />
            <label for="apic-scope">Scope</label>
            <input list="scope-options" id="apic-scope" name="apicScope" value="scope1" />
            <datalist id="scope-options">
                <option value="scope1"/>
            </datalist>
            <br />

            <label for="env-select">Environment</label>
            <select id="env-select">
                <optgroup label="Development">
                    <option value="dv1">dv1</option>
                </optgroup>

                <optgroup label="QA">
                    <option value="sit1">sit1</option>
                    <option value="sit2">sit2</option>
                    <option value="sit3">sit3</option>
                    <option value="sit4">sit4</option>
                    <option value="sit5">sit5</option>
                    <option value="sit6">sit6</option>
                    <option value="sit7">sit7</option>
                    <option value="sit8">sit8</option>
                    <option value="sit9">sit9</option>
                </optgroup>
                <optgroup label="Performance">
                    <option value="perf">PERF</option>
                </optgroup>
                <optgroup label="Production">
                    <option value="prod">PROD</option>
                </optgroup>
            </select>
        </fieldset>
    </form>
)

const App = () => (
    <div class="forms" id="forms">
        <Settings />
        <Consumer />
    </div>
)

document.getElementById("root")?.appendChild(<App /> as Node);