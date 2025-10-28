export function createElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);

    Object.keys(attributes).forEach(key => {
        if (key === 'className') {
            element.className = attributes[key];
        } else if (key === 'textContent') {
            element.textContent = attributes[key];
        } else if (key === 'innerHTML') {
            element.innerHTML = attributes[key];
        } else if (key.startsWith('on') && typeof attributes[key] === 'function') {
            element.addEventListener(key.slice(2).toLowerCase(), attributes[key]);
        } else {
            element.setAttribute(key, attributes[key]);
        }
    });

    children.forEach(child => {
        if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child));
        } else if (child instanceof Node) {
            element.appendChild(child);
        }
    });

    return element;
}

export function createList(items, itemRenderer, containerClass = 'list') {
    const container = createElement('div', { className: containerClass });

    items.forEach(item => {
        const itemElement = itemRenderer(item);
        container.appendChild(itemElement);
    });

    return container;
}

export function createButton(text, onClick, className = 'btn btn-primary') {
    return createElement('button', {
        className,
        onclick: onClick
    }, [text]);
}
