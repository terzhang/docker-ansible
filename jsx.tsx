type Props = {
    [key:string]: any
}

function createElement (tag: string | Function, props: Props, ...children: (string | Node)[]) {
    if (typeof tag === "function") return tag(props, ...children);
    const element = document.createElement(tag);
    
    Object.entries(props || {}).forEach(([name, value]) => {
        if (name.startsWith("on") && name.toLowerCase() in window)
        element.addEventListener(name.toLowerCase().substring(2), value);
        else element.setAttribute(name, value.toString());
    });
    
    children.forEach(child => {
        appendChild(element, child);
    });
    
    return element;
};

const createFragment = (_props: Props, ...children: (string | any)[]) => children

const appendChild = (parent: Node, child: string | Node | Node[]) => {
    if (Array.isArray(child)) {
        child.forEach(nestedChild => appendChild(parent, nestedChild));
    } else if (typeof child === 'string' || child instanceof String) {
        parent.appendChild(document.createTextNode(child as string));
    } else {
        // console.log(child)
        parent.appendChild(child)
    }
};