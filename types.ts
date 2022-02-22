type APIC_SPACE = "cs" | string

enum ENV {
    "dv1",
    "sit1", "sit2", "sit3", "sit4", "sit5", "sit7", "sit8", "sit9",
    "perf",
    "prod"
}
type CommonVars = {
    apic_server?: string,
    apic_realm?: string,
    apic_scope?: string,
    /* dropdown */
    env: ENV
    apic_namespace: string,
}

type API = { 
    api_name: string, 
    api_id: string, 
    bian_domain: string, 
    target_url: string, 
    base_path: string, 
    swagger_json: string 
}
type BuildVars = {
    /* list of api info */
    apis: NonEmptyArray<API>,
}

type Product = {
    api_name: string,
    plan_name?: string,
    apic_space?: APIC_SPACE
}
type PubVars = {
    /* TBA - for now define it in YAML, then use its plan name in product */
    plan?: {},
    /* list of products */
    products: NonEmptyArray<Product>
}
// web uses advanced version
// | {
//     apic_space: APIC_SPACE
// }

export type Consumer = {
    consumer_app: string,
    consumer_org: string,
    apic_space?: APIC_SPACE,
    products: NonEmptyArray<string> // Product[] in the future
}
type SubVars = {
    /* list of consumers */
    consumers: Consumer[],
    apic_space?: string
} 
// web always uses advanced versions
// | {
//     apic_space: string,
//     consumer_app: string,
//     consumer_org: string,
// }

type GenVars = {
    artifactory?: boolean,
    jira?: boolean,
    confluence?: boolean
}
export type BuildPubVars = CommonVars & BuildVars & Partial<PubVars>;

export type BuildPubSubVars = CommonVars & BuildVars & Partial<PubVars> & SubVars;

// const what: BuildPubSubVars = {
//     env: ENV.dv1,
//     apic_space: '',
//     apic_namespace: '',
//     apis: [
//         {
//             api_name: 'string', 
//             api_id: 'string', 
//             bian_domain: 'string', 
//             target_url: 'string', 
//             base_path: 'string', 
//             swagger_json: 'string' 
//         }
//     ],
//     consumer_app: '',
//     consumer_org: '',
//     // consumers: []
// }

export type BuildGenVars = CommonVars & BuildVars & Partial<PubVars> & SubVars & GenVars;

export type NonEmptyArray<T> = [T, ...T[]]
export type Common<T, U> = keyof T & keyof U | {}
export type UniqueLeft<T, U> = Pick<T ,Exclude<keyof T, keyof U>>
export type UniqueRight<T, U> = Pick<U ,Exclude<keyof U, keyof T>>
export type Merge<T, U> = Common<T, U> & UniqueLeft<T, U> & UniqueRight<T, U>;

export type AllVars = CommonVars & BuildVars & Partial<PubVars> & SubVars & GenVars;