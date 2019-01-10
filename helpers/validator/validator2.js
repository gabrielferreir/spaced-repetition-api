module.exports = init;

let errors = [];

function init(params, schema) {
    errors = [];
    return validate(params, schema, null);
}

function validate(params, schema, heritage) {
    if (Array.isArray(params)) {
        params.forEach((obj, index) => validateObject(obj, schema, `${heritage}(${index})`));
    } else {
        validateObject(params, schema, heritage);
    }

    return {
        status: 400,
        errors: errors
    }
}

function callFunction(name, params) {
    const vFunc = validators[name];
    if (vFunc) {
        return vFunc(params)
    }
}

function validateObject(params, schema, heritage) {
    const keys = Object.keys(schema);
    keys.forEach(key => {

        const arrayProperties = Object.keys(schema[key]);

        arrayProperties.forEach(propertyValidator => {
            const valueProperty = schema[key][propertyValidator];
            // key = name
            // valueProperty = true
            // validators[propertyValidator](key, valueProperty, params[key]);
            const response = callFunction(propertyValidator, {
                key: heritage ? `${heritage}.${key}` : key,
                valueProperty: valueProperty,
                param: params ? params[key] : undefined
            })

            response && errors.push(response);
        });
    });
}

validators = {
    required: request => {
        if (!request.param && request.valueProperty === true) {
            return {
                message: `${request.key} is required`,
                type: 'required'
            }
            // errors.push(`${request.key} is required`);
        }
    },
    minLength: request => {
        if (request.param && request.param.length < request.valueProperty) {
            // console.log(`${request.key} it's smaller than ${request.valueProperty}`);
            return {
                message: `${request.key} it's smaller than ${request.valueProperty}`,
                type: 'minLength'
            }
            // errors.push(`${request.key} it's smaller than ${request.valueProperty}`);
        }
    },
    type: request => {

        if (request.valueProperty === Array) {
            if (Array.isArray(request.param)) {

            } else {
                // console.log(`${request.key} not is type Array`);
                // errors.push(`${request.key} not is type Array`);
                return {
                    message: `${request.key} not is type Array`,
                    type: 'type'
                }
            }
        }

    },
    min: request => {
        if (!request.param || request.param.length < request.valueProperty) {
            // console.log(`${request.key} <\array> it's smaller than ${request.valueProperty}`);
            // errors.push(`${request.key} <\array> it's smaller than ${request.valueProperty}`);
            return {
                message: `${request.key} <\array> it's smaller than ${request.valueProperty}`,
                type: 'min'
            }
        }
    },
    max: request => {
        if (request.param && request.param.length > request.valueProperty) {
            // errors.push(`${request.key} <\array> it's bigger  than ${request.valueProperty}`);
            return {
                message: `${request.key} <\array> it's bigger  than ${request.valueProperty}`,
                type: 'max'
            }
        }
    },
    childs: request => {
        validate(request.param, request.valueProperty, request.key);
    }
};