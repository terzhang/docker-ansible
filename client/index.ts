// type GlobalInputs = {
//     apicServer: HTMLInputElement
//     apicRealm: HTMLInputElement
//     apicScope: HTMLInputElement
// }

// function getGlobalVars(): Record<keyof GlobalInputs, string> | null {

//     const apicSettingsFields: HTMLFieldSetElement | null = document.forms.namedItem(Forms.apicSettings)?.fields
//     // console.log(apicSettingsFields)
//     if (!apicSettingsFields) return null;
    
//     const apicSettingInputs = apicSettingsFields.elements as HTMLCollectionOf<HTMLInputElement & GlobalInputs>

//     // const { apicServer, apicRealm, apicScope } = apicSettingInputs;

//     const apicServer = apicSettingInputs.namedItem("apicServer")?.value
//     const apicRealm = apicSettingInputs.namedItem("apicRealm")?.value
//     const apicScope = apicSettingInputs.namedItem("apicScope")?.value

//     if (!apicServer || !apicRealm || !apicScope ) return null;

//     const globalSettings = {
//         apicServer ,
//         apicRealm,
//         apicScope
//     }
    
//     return globalSettings;
// }

// type ConsumerInputs = {
//     consumerApp: HTMLInputElement,
//     consumerOrg: HTMLInputElement,
//     consumerAlias: HTMLInputElement,
//     apicSpace?: HTMLInputElement,
// }

// type ConsumerValue = Omit<Record<keyof ConsumerInputs, string>, "apicSpace"> & { apicSpace?: string}

// function getConsumerInfo(): ConsumerValue[] | null {
//     const consumerForm = document.forms.namedItem(Forms.consumerInfo);
//     if (!consumerForm) return null;
    
//     const fieldsets = consumerForm.children as HTMLCollectionOf<HTMLFieldSetElement>;
    
//     const consumerInfo: ConsumerValue[] = [];
//     for (let fieldset of fieldsets ) {
//         // console.log(fieldset)
//         const input = fieldset.elements as HTMLCollectionOf<HTMLInputElement & ConsumerInputs>; 
        
//         const consumerApp = input.namedItem("consumerApp")?.value
//         const consumerOrg = input.namedItem("consumerOrg")?.value
//         const consumerAlias = input.namedItem("consumerAlias")?.value
//         const apicSpace = input.namedItem("apicSpace")?.value

//         if (!consumerApp || !consumerOrg || !consumerAlias) return null;

//         consumerInfo.push({
//             consumerApp,
//             consumerOrg,
//             consumerAlias, 
//             apicSpace: apicSpace ? apicSpace : undefined
//         })
//     }

//     return consumerInfo
// }

// TODO: 1. implement a reset for each section
// TODO: 2. client make http request back to server
// TODO: 3. server handle command route and run unix command


export enum Forms {
    apicSettings = "apic-settings",
    consumerInfo = "consumer-info",
    deploymentVars = "deploy-vars"
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