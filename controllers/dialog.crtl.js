"use strict";
const db = require("../models");
const logger = require("../modules/winton");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/.env" });
const {Configuration, OpenAIApi} = require("openai");

const configuration = new Configuration({
    apiKey: "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",
});

const openai = new OpenAIApi(configuration);


const getIntense = async (userNo, newDialog ,callback) => {
    const start = Date.now();
    const prompt = "User Questions:" + newDialog + "\
    There are three types of answers to user questions.\
First, a situation where you have to recommend a recipe. Second, I recommend a shopping list. Third, all conversations except the first and the second. Which of the three should I answer to the user question above? Answer only in the JSON form of {answerTypeIndex:<INT>}";
    console.log("isit fuck?");   
    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content: prompt}],
        temperature: 0,
        top_p : 1
    });
    console.log("isit fuck?");
    const duration = Date.now() - start;
    console.log(response.data.choices[0].message.content);
    callback(JSON.parse(response.data.choices[0].message.content).answerTypeIndex);
    console.log(duration / 1000);
}
const getOpeningDialog = async (nang,callback) => {
    const start = Date.now();
    console.log(nang.cacheddialog);
    const prompt = "User Refrigerator Item:" + nang + 
    "Please analyze the items in the user's refrigerator and give me 3 sentences of advice or each item's status briefing with foodname.\
    For the output format, please Korean answer in {responseAdvice:<TEXT>} JSON format."
    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content: prompt}],
        temperature: 0,
        top_p : 1
    });

    
    const duration = Date.now() - start;
    console.log(response.data.choices[0].message.content);
    console.log(duration / 1000);
    callback(response.data.choices[0].message.content);
}
const getShoppingList = async (newDialog) => {
    const start = Date.now();
    const prompt = "User Questions:" + newDialog + "\
    There are three types of answers to user questions.\
First, a situation where you have to recommend a recipe. Second, I recommend a shopping list. Third, all conversations except the first and the second. Which of the three should I answer to the user question above? Answer only in the JSON form of {answerTypeIndex:<INT>}";

    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content: prompt}],
        temperature: 0,
        top_p : 1
    });
    
    const duration = Date.now() - start;
    console.log(response.data.choices[0].message.content);
    callback(JSON.parse(response.data.choices[0].message.content).answerTypeIndex);
    console.log(duration / 1000);
}

const getRecipe = async (userNo, newDialog ,callback) => {
    const start = Date.now();
    const prompt = "User Questions:" + newDialog + "\
    There are three types of answers to user questions.\
First, a situation where you have to recommend a recipe. Second, I recommend a shopping list. Third, all conversations except the first and the second. Which of the three should I answer to the user question above? Answer only in the JSON form of {answerTypeIndex:<INT>}";

    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content: prompt}],
        temperature: 0,
        top_p : 1
    });
    
    const duration = Date.now() - start;
    console.log(response.data.choices[0].message.content);
    callback(JSON.parse(response.data.choices[0].message.content).answerTypeIndex);
    console.log(duration / 1000);
}


const data = {

    
    getEssentialDatabyUserNo: async (req, res, next) => {
        let userNo = req.params.user_no;
        if (!userName) {
            res.json({ results: false, message: "No request params" });
            return;
        }
        db.user
            .findOne({
                attributes: ["no", "username","essentialdata"],
                where: { no: userNo },
            })
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                next(err);
            });
    },
    
};

const process = {
    
    initNang : async (req,res,next) => {
        let userNo = req.params.userNo;
        let userF = false;
        logger.info(JSON.stringify(req.params));
        var array = [{
            food : "삼겹살",
            deadline : "2023-06-15",
            capacity : 2,
            is_new : 0,
            user_no : userNo,
        },{
            food : "대파",
            deadline : "2023-06-7",
            capacity : 1,
            is_new : 0,
            user_no : userNo,
        },{
            food : "양파",
            deadline : "2023-06-15",
            capacity : 0,
            is_new : 0,
            user_no : userNo,
        },
        {
            food : "고추가루",
            deadline : "2040-01-01",
            capacity : -1,
            is_new : 0,
            user_no : userNo,
        }];
        for (let food of array){
            db.foods
            .create(
                food
            )
            .then((result)=>{
                userF = true;
                console.log(result);
            })
            .catch((error)=> {
                userF = false;
                next(error);
            });
        }
        res.status(201).send({result : true});

        
    },
    checkIntense : async (req,res,next)=>{
        let question = req.body.userAsk;
        getIntense(1, question,function(responses){
            console.log(responses)
        });
        res.status(202).send();
    },
    checkQeued : async (req,res,next)=>{
        let userNo = req.params.userNo;

        db.user
        .findOne(
            {where : { no : userNo}}
        ).then((result)=>{
            if(result.isQeued)res.status(200).send("OK");
            else res.status(204).send("NoContent");
        })
        .catch((error)=>{
            next(error);
        });

    },
    createOpeningDialog : async (req,res,next)=>{

        let userNo = req.params.userNo;
        let foods;
        db.foods
        .findAll({
            attributes: ["food", "deadline","is_new","capacity"],
            where : {user_no : userNo}
        })
        .then((result)=>{
            getOpeningDialog(result,function(dialogs){
                console.log(dialogs);
                db.qeue
                .create(
                    {
                        order : 0,
                        wimnchat : dialogs,
                        types : 3,
                        user_no : userNo
                    }
                ).then((results)=>{
                    console.log(results);
                    db.user
                    .update({
                        isQeued: true
                    },{where : {no : userNo}}) .then((results)=>{
                        logger.info(JSON.stringify(results));
                    })
                    .catch((error)=>{
                        next(error);
                    })
                })
                .catch((error)=>{
                    next(error);
                })
            });
        })
        .catch((error)=>{
            next(error);
        });
        
        res.status(202).send();
        
    },
    popDialog: async (req,res,next)=>{
        let userNo = req.params.userNo;
        logger.info(JSON.stringify(req.params));

        db.qeue
        .findAll(
            {where : {user_no : userNo},order : [['order', 'ASC']]}
        )
        .then((result)=>{

            res.status(200).send(result)
            db.qeue
            .destroy(
                {where : {user_no : userNo}}
            )
            .then((result)=>{
                logger.info(result);
            })
            .catch((error)=>{
                next(error);
            })
        })
    },
    userAsk: async (req, res, next) => {
        let data = req.body;
        logger.info(JSON.stringify(req.body));
        let flag = false;
        if (data == null) {
            res.json({ results: false, message: "No request body" });
            return;
        }
        runPrompt(data.userNo, data.dialog, function(Chatresp ,usern,userdial){

            let orders;
            db.cacheddialog
            .findAll(

                {where : {user_no : usern}}
            )
            .then( (results)=>{
                orders = length(results)+1;
            })
            .catch((err)=>{
                next(err);
            });


            db.cacheddialog
            .create({
                user_no: data.usern,
                userchat: userdial,
                wimnchat : Chatresp,
                order : orders,
            })
            .then((results) => {
                flag = true;
            })
            .catch((err) => {
                next(err);
            });
        });
        res.status(202).send();
        
    },


    
        
};

module.exports = {
    data,
    process,
};