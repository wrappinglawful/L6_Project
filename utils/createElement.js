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

export function createForm(fields, onSubmit, submitText = 'Submit') {
    const form = createElement('form', {
        onsubmit: (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = {};

            fields.forEach(field => {
                if (field.type === 'checkbox') {
                    const checkbox = e.target.querySelector(`[name="${field.name}"]`);
                    data[field.name] = checkbox ? checkbox.checked : false;
                } else {
                    data[field.name] = formData.get(field.name) || '';
                }
            });

            onSubmit(data);
        }
    });

    fields.forEach(field => {
        const fieldGroup = createElement('div', { className: 'form-group' });

        if (field.type === 'checkbox') {
            const checkboxId = `checkbox-${field.name}-${Date.now()}`;

            const checkbox = createElement('input', {
                type: 'checkbox',
                name: field.name,
                checked: field.checked || false,
                className: 'checkbox-input',
                id: checkboxId
            });

            const label = createElement('label', {
                className: 'checkbox-label',
                for: checkboxId
            }, [field.label]);

            fieldGroup.appendChild(checkbox);
            fieldGroup.appendChild(label);
        } else {
            const label = createElement('label', {}, [field.label]);
            fieldGroup.appendChild(label);

            let input;
            if (field.type === 'textarea') {
                input = createElement('textarea', {
                    name: field.name,
                    placeholder: field.placeholder || '',
                    required: field.required || false
                });
            } else {
                input = createElement('input', {
                    type: field.type || 'text',
                    name: field.name,
                    placeholder: field.placeholder || '',
                    required: field.required || false
                });
            }

            fieldGroup.appendChild(input);
        }

        form.appendChild(fieldGroup);
    });

    const submitButton = createElement('button', {
        type: 'submit',
        className: 'btn btn-primary'
    }, [submitText]);

    form.appendChild(submitButton);

    return form;
}

export function createButton(text, onClick, className = 'btn btn-primary') {
    return createElement('button', {
        className,
        onclick: onClick
    }, [text]);
}

export function createSearchInput(placeholder, onInput, debounceMs = 300) {
    let timeoutId;

    const input = createElement('input', {
        type: 'text',
        className: 'search-input',
        placeholder,
        oninput: (e) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                onInput(e.target.value);
            }, debounceMs);
        }
    });

    return input;
}
