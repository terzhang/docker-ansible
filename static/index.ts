type GlobalInputs = {
    apicServer: HTMLInputElement
    apicRealm: HTMLInputElement
    apicScope: HTMLInputElement
}

function getGlobalVars(): Record<keyof GlobalInputs, string> | null {

    const apicSettingsFields: HTMLFieldSetElement | null = document.forms.namedItem('apic_settings')?.fields
    // console.log(apicSettingsFields)
    if (!apicSettingsFields) return null;
    
    const apicSettingInputs = apicSettingsFields.elements as HTMLCollectionOf<HTMLInputElement & GlobalInputs>

    // const { apicServer, apicRealm, apicScope } = apicSettingInputs;

    const apicServer = apicSettingInputs.namedItem("apicServer")?.value
    const apicRealm = apicSettingInputs.namedItem("apicRealm")?.value
    const apicScope = apicSettingInputs.namedItem("apicScope")?.value

    if (!apicServer || !apicRealm || !apicScope ) return null;

    const globalSettings = {
        apicServer ,
        apicRealm,
        apicScope
    }
    
    return globalSettings;
}

type ConsumerInputs = {
    consumerApp: HTMLInputElement,
    consumerOrg: HTMLInputElement,
    consumerAlias: HTMLInputElement,
    apicSpace?: HTMLInputElement,
}

type ConsumerValue = Omit<Record<keyof ConsumerInputs, string>, "apicSpace"> & { apicSpace?: string}

function getConsumerInfo(): ConsumerValue[] | null {
    const consumerForm = document.forms.namedItem('consumer_info');
    if (!consumerForm) return null;
    
    const fieldsets = consumerForm.children as HTMLCollectionOf<HTMLFieldSetElement>;
    
    const consumerInfo: ConsumerValue[] = [];
    for (let fieldset of fieldsets ) {
        // console.log(fieldset)
        const input = fieldset.elements as HTMLCollectionOf<HTMLInputElement & ConsumerInputs>; 
        
        const consumerApp = input.namedItem("consumerApp")?.value
        const consumerOrg = input.namedItem("consumerOrg")?.value
        const consumerAlias = input.namedItem("consumerAlias")?.value
        const apicSpace = input.namedItem("apicSpace")?.value

        if (!consumerApp || !consumerOrg || !consumerAlias) return null;

        consumerInfo.push({
            consumerApp,
            consumerOrg,
            consumerAlias, 
            apicSpace: apicSpace ? apicSpace : undefined
        })
    }

    return consumerInfo
}

function getFieldsetInputs<T>(fieldset: HTMLFieldSetElement, filters?: string[]) {
    const fieldValues = {} as {[key: string]: string};
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

function getFormInputs<T extends {[key: string]: T[string]}>(formName: string, filters?: (Extract<keyof T, string>)[]) {
    const fieldsets = document.forms.namedItem(formName as string)?.children;
    if (!fieldsets) return null;
    
    const fieldValues = [];
    for (let fieldset of <HTMLCollectionOf<HTMLFieldSetElement & T>>fieldsets) {
        const inputValues = getFieldsetInputs<T>(fieldset, filters)
        fieldValues.push(inputValues);
    }
}

// TODO: 1. implement a reset for each section
// TODO: 2. client make http request back to server
// TODO: 3. server handle command route and run unix command
// TODO: 4. implement adding and deleting new consumer fields and var fields


enum Forms {
    apicSettings = "apic_settings",
    consumerInfo = "consumer_info",
    deploymentVars = "deploy_vars"
}

const getAllInputs = () => {
    const globals = getGlobalVars();
    const consumerInfo = getConsumerInfo();
    const deploymentVars = getFormInputs(Forms.deploymentVars)
    return {
        globals,
        consumerInfo,
        deploymentVars
    }
}

// button submit callback
const buildGen = document.getElementById('buildGen')! as HTMLInputElement;
buildGen.onclick = () => {
    alert(JSON.stringify(getAllInputs()))
}

const buildPub = document.getElementById('buildPub')! as HTMLInputElement;
buildPub.onclick = () => {
    alert(JSON.stringify(getAllInputs()))
}

const buildPubSub = document.getElementById('buildPubSub')! as HTMLInputElement;
buildPubSub.onclick = () => {
    alert(JSON.stringify(getAllInputs()))
}

const resetForms = (forms: Forms[] = [Forms.apicSettings, Forms.consumerInfo, Forms.deploymentVars]) => {
    forms.forEach(formName => {
        // get their HTMLFormElement and reset
        document.forms.namedItem(formName)?.reset()
        console.log(formName+" is reset.")
    })
}

const resetButton = document.getElementById('resetButton')! as HTMLButtonElement;
resetButton.onclick = () => resetForms()

// TODO: this is pretty dependent to the HTML structure
// add a consumer form (comes with a single variable fieldset)
const addConsumer = (parent: HTMLElement) => {
    // get first consumer and clone it
    const firstForm = document.getElementById('consumer-info') as HTMLFormElement;
    const newForm = firstForm.cloneNode(true) as HTMLFormElement;

    // get the list of variable fields of first consumer
    const deploymentVars = newForm.children.namedItem('deploy-vars') as HTMLUListElement;
    
    // get the very first variable field (guaranteed to exist)
    const firstVarField = deploymentVars.firstElementChild

    // delete the fields in the variable field list
    deploymentVars.replaceChildren();

    // guard just in case first variable field don't exist
    if (!firstVarField) return;
    
    // add a single variable field to the consumer vars list
    deploymentVars.appendChild(firstVarField)

    // clean the form input before adding to parent
    newForm.reset()
    parent.appendChild(newForm);
}
// get forms div by class
const forms = document.getElementById('forms') as HTMLDivElement;
addConsumer(forms);