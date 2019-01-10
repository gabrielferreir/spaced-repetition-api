const functions = require('./functions');

function validador(param, schema, path) {
    const erros = [];
    if (Array.isArray(schema)) {
        schema = schema[0];
        path = path + '[]';
    }
    Object.keys(schema).forEach(property => {
        if (schema[property] instanceof Object) {
            const subErrors = validador(param, schema[property], `${path ? path + '.' : ''}${property}`);
            erros.push(...subErrors);
        } else {
            const response = _valida(param, path, property, schema[property]);
            response && response.length && erros.push(...response);
        }
    });
    return erros;
}

function _valida(parametros, caminho, funcao, valorDaFuncao) {
    // console.log(caminho, funcao, valorDaFuncao);
    const arrayPath = caminho.split('.');
    const find = findProperty(parametros, arrayPath) || [];
    // console.log(find);
    console.log('----------')
    const array = [];
    find.forEach((fin, index) => {
        const result = functions[funcao](fin.path, valorDaFuncao, fin.value);
        if (result) array.push({...result, fullPath: fin.fullPath, index: find.length > 1 ? index : undefined});
    });
    return array;
}

function findProperty(params, fullPath, path) {
    // console.log('fullPath', fullPath);
    // console.log('path', path);
    // let itensQueDevemSerValidados = [];
    // let backupFullPath = fullPath ? fullPath.slice() : [];
    // path = path || fullPath;
    // if (path.length > 1) {
    //     let removed = path.shift();
    //     if (removed.substr(-2) === '[]') {
    //         removed = removed.substr(0, removed.length - 2);
    //         const obj = params[removed] || [];
    //         obj.forEach(property => {
    //             // console.log('property', property);
    //             itensQueDevemSerValidados.push({
    //                 path: path[0],
    //                 value: property[path[0]],
    //                 fullPath: backupFullPath.join('.')
    //             });
    //         })
    //         // console.log('AAAAAAAAAAAAAA', params[removed], backupFullPath, path);
    //     } else {
    //         // console.log('B');
    //         findProperty(params[removed], backupFullPath, path);
    //     }
    // } else {
    //     // console.log('A');
    //     itensQueDevemSerValidados.push({path: path[0], value: params[path[0]], fullPath: backupFullPath.join('.')});
    // }
    // console.log('itensQueDevemSerValidados', itensQueDevemSerValidados);
    // return itensQueDevemSerValidados;
    nextProperty(params, fullPath);
}

function nextProperty(params, array) {
    if (array.length > 1) {
        let removed = array.shift();
        if (removed.substr(-2) === '[]') {
            removed = removed.substr(0, removed.length - 2);
            console.log('array', array);
            return nextProperty(params, array);
            // const obj = params[removed] || [];
            // obj.forEach(property => {
            //     // console.log('property', property);
            //     // itensQueDevemSerValidados.push({
            //     //     path: path[0],
            //     //     value: property[path[0]],
            //     // fullPath: backupFullPath.join('.')
            // });
        }
    } else {
        console.log('propertie ', array[0]);
        console.log('value ', params[array[0]]);
        return array;
    }
}

module.exports = validador;