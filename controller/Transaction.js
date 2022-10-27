import Users from "../models/UserModel.js";
import Transactions from "../models/TransactionModel.js";



export const getTransaction = async(req, res)=>{
    try {
        const response = await Transactions.findAll({
            attributes:['uuid','name', 'address', 'phone','note','order'],
            where: {
                userId: req.userId
            },
            include:[{
                model: Users,
                attributes:['name','email']
            }]
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getTransactionById = async(req, res)=>{
    try {
        const response = await Transactions.findOne({
            attributes:['uuid','address', 'name', 'phone','note','order'],
            where: {
                uuid:req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }

}

export const createTransaction = async(req, res)=>{
    if(req.order === null) return res.status(404).json({msg:"No Product Found"});
    const{name, address, phone, note,order} = req.body;
    try {
        await Transactions.create({
            name: name,
            address: address,
            phone: phone,
            note: note,
            order:order,
            userId: req.userId,
            product: req.productId
            
        });
        res.status(201).json({msg:"Tansaction Success"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }

}

export const updateTransaction = async(req, res)=>{
    const transaction = await Transactions.findOne({
        where: {
            id: req.params.id
        }
    });
    if(!transaction) return res.status(404).json({msg:"No Transaction Found"});
    const{name, address, phone, note, order} = req.body;
        try {await Transactions.update({
            name: name,
            address: address,
            phone: phone,
            note: note,
            order: order
        },{
            where:{
                id:transaction.id
            }
        });
        res.status(200).json({msg:"Transaction Updated Success"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
};

export const deleteTransaction = async(req, res)=>{
    const transaction = await Transactions.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if(!transaction) return res.status(404).json({msg:"No Found Transaction"});
    try {
        await Transactions.destroy({
            where:{
                id:transaction.id
            }
        });
        res.status(200).json({msg:"Transaction Deleted"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }

}