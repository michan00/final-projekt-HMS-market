import Product from "../models/ProductModel.js";
import { Op } from "sequelize";
import path from "path";
import fs from "fs";
import Users from "../models/UserModel.js";

export const getProducts = async(req, res)=>{
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const search =req.query.search_query || "";
    const offset = limit*page;
    const totalRows = await Product.count({
        where:{
            [Op.or] : [{name:{
                [Op.like]: '%'+search+'%'
            }},{category:{
                [Op.like]: '%'+search+'%'
            }}]
        }
    });
    const totalPage = Math.ceil(totalRows / limit);
    const result = await Product.findAll({
        where:{
            [Op.or] : [{name:{
                [Op.like]: '%'+search+'%'
            }}, {category:{
                [Op.like]: '%'+search+'%'
            }}]
        },
        offset:offset,
        limit:limit,
        order:[
            ['id', 'DESC']
        ]
    });
    res.json({
        result:result,
        page:page,
        limit:limit,
        totalRows: totalRows,
        totalPage:totalPage
    });
    // try {
    //     const response = await Product.findAll({
    //         attributes:['uuid','id','name','price','category','description','image','url'],
    //         include:[{
    //             model: Users,
    //             attributes:['name','email']
    //         }]
    //     });
    //     res.json(response);
    // } catch (error) {
    //     res.status(500).json({msg: error.message})
    // }
}

export const getProductUser = async(req,res)=>{
    try {
        let response;
        if (req.email === 'admin@gmail.com') {
            response = await Product.findAll({
                attributes:['uuid','name','price','category','description','image','url'],
                include:[{
                    model: Users,
                    attributes:['name','email']
                }]
            });
        } else{
            response = await Product.findAll({
                attributes:['uuid','name','price','category','description','image','url'],
                where: {
                    userId: req.userId
                },
                include:[{
                    model: Users,
                    attributes:['name','email']
                }]
            })
        }
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getProductsById = async(req, res)=>{
    try {
        const response = await Product.findOne({
            attributes:['uuid','id','name','price','category','description','image','url'],
            where:{
                uuid: req.params.id
            }
        });
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
}

export const saveProducts = async(req, res)=>{
    if(req.file === null) return res.status(400).json({msg:"No file Uploader"});
    const name = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    const category = req.body.category;
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    const allowedType = ['.png','.jpeg','.jpg'];

    if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg:"Invalid Images"});
    if(fileSize > 5000000) return res.status(422).json({msg: "Images must be less than 5mb"});

    file.mv(`./public/images/${fileName}`,async(err)=>{
        if(err) return res.status(500).json({msg: err.message});
        try {
            await Product.create({userId:req.userId, name: name, image: fileName, url: url, price: price, description: description, category: category});
            res.status(201).json({msg:"Product Created Success"});
        } catch (error) {
            console.log(error.message);
        }
    });
}

export const updateProducts = async(req, res)=>{
    const product = await Product.findOne({
        where:{
            uuid: req.params.id
        }
    });
    if(!product) return res.status(404).json({msg:"No Data Found!"});
    let fileName= "";
    if(req.file === null){
        fileName = Product.image;
    }else {
        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        fileName = file.md5 + ext;
        const allowedType = ['.png','.jpeg','.jpg'];

        if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg:"Invalid Images"});
        if(fileSize > 5000000) return res.status(422).json({msg: "Images must be less than 5mb"});

        const filepath = `./public/images/${product.image}`;
        fs.unlinkSync(filepath);

        file.mv(`./public/images/${fileName}`,(err)=>{
            if(err) return res.status(500).json({msg: err.message});
        });

    }
    const name = req.body.title;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    const price = req.body.price;
    const description = req.body.description;
    const category = req.body.category;
    try {
        await Product.update({name:name, image:fileName, url:url,price:price,description:description,category:category},{
            where:{
                uuid:req.params.id
            }
        });
        res.status(200).json({msg:"Product Updated Successfuly"})
    } catch (error) {
        console.log(error.message);
    }
}

export const deleteProducts = async(req, res)=>{
    const product = await Product.findOne({
        where:{
            uuid: req.params.id
        }
    });
    if(!product) return res.status(404).json({msg:"No Data Found!"});
    try {
        const filepath = `./public/images/${product.image}`;
        fs.unlinkSync(filepath);
        await Product.destroy({
            where:{
                uuid: req.params.id
            }
        });
        res.status(200).json({msg:"Product Deleted Successfuly"});
    } catch (error) {
        console.log(error.message);
    }
}