async function paginate(schema, params) {

    const records = await schema.find(
        {name: new RegExp(params.filter, 'i')}
    )
        .skip((params.page - 1) * params.quantity)
        .limit(params.quantity)

    const total = await schema.find(
        {name: new RegExp(params.filter, 'i')}
    )
        .skip((params.page - 1) * params.quantity)
        .limit(params.quantity)
        .countDocuments();

    return {
        records: records,
        total: total
    }

}

module.exports = paginate;