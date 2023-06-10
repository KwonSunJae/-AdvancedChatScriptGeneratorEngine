"use strict";
const { error } = require("winston");
const db = require("../models");
const logger = require("../modules/winton");
const dotenv = require("dotenv");
dotenv.config({ path: "./.config/.env" });
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.API_KEY,
});

const openai = new OpenAIApi(configuration);


const getIntense = async (userNo, newDialog, callback) => {
    const start = Date.now();
    const prompt = "User Ask : \"" + newDialog;
    const systemp = "There are three types of answers to user questions.\
First, a situation where you have to recommend a recipe. Second, I recommend a shopping list. The third is a casual conversation, all conversations that do not apply to the first and second. Which of the three should I answer to the user question above? Please Answer only in the JSON form of { \"answerTypeIndex\": <INT> } Never answer except in JSON format. ";

    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "system", content: systemp }, { role: "user", content: prompt }],
        temperature: 0,
        top_p: 1
    });
    const duration = Date.now() - start;
    console.log(response.data.choices[0].message.content);
    callback(JSON.parse(response.data.choices[0].message.content.split("(")[0]).answerTypeIndex, userNo, newDialog);
    console.log(duration / 1000);
}

const messageGenerator = (systemp, prompt, cachedDialog) => {
    let message = [];
    cachedDialog.sort((c1, c2) => c1.order - c2.order);

    for (let i = 0; i < cachedDialog.length; i++) {
        message.push({
            role: "user",
            content: cachedDialog[i].userchat
        });
        message.push({
            role: "assistant",
            content: cachedDialog[i].wimnchat
        });
    }

    message.push({
        role: "system",
        content: systemp
    });

    message.push({
        role: "user",
        content: prompt
    });

    return message;
}

const getDaily = async (userNo, newDialog, f, u, c, callback) => {
    const start = Date.now();
    console.log(newDialog);
    let foods = f;
    let userInfo = u;
    let cacheddialog = c;

    // Before
    // let prompt = "User information for the current conversation: " + await userInfo + "\
    // User Refrigerator's Ingredients List: " + await foods + "\
    // Previous conversation:" + await cacheddialog + "User Talk:" + await newDialog + "\
    // UserTalk above is what User said. You have to rsponse about 1 line in Korean.Please answer in the JSON form of { \"response\" : \"<TEXT>\"}."

    // After
    let prompt = "User information for the current conversation: " + await userInfo + "\
    User Refrigerator's Ingredients List: " + await foods + "\
    User Talk:" + await newDialog + "\
    UserTalk above is what User said. You have to rsponse about 1 line in Korean.Please answer in the JSON form of { \"response\" : \"<TEXT>\"}."

    const systemp = "Your name is \"왓마냉(wimn)\" The function you are providing is an intelligent secretary who communicates with users. When you answer, you have to answer with ONLY JSON format according to the specified form. Do not say another response."
    console.log(prompt);
    const message = messageGenerator(systemp, prompt, cacheddialog);
    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: message,
        temperature: 0,
        top_p: 1
    });
    const duration = Date.now() - start;
    console.log(response.data.choices[0].message.content);
    callback(JSON.parse(response.data.choices[0].message.content.split("(")).response, newDialog);
    console.log(duration / 1000);
}


const getOpeningDialog = async (nang, callback) => {
    const start = Date.now();
    console.log(nang);
    const prompt = "User Refrigerator Item:" + JSON.stringify(nang) +
        "Please analyze the items in the user's refrigerator and give me 3 sentences of advice or item's status briefing with food attributes.\
    For the output format, please Korean answer in {responseAdvice:<TEXT>} JSON format."
    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0,
        top_p: 1
    });


    const duration = Date.now() - start;
    console.log(response.data.choices[0].message.content);
    console.log(duration / 1000);
    callback(JSON.parse(response.data.choices[0].message.content).responseAdvice);
}
const getShoppingList = async (userNo, newDialog, f, u, c, callback) => {
    const start = Date.now();
    console.log(newDialog);
    let foods = f;
    let userInfo = u;
    let cacheddialog = c;

    let prompt = "User information for the current conversation: " + await userInfo + "\
    User Refrigerator's Ingredients List: " + await foods + "\
    User Ask : \"" + newDialog +"\"\
    Based on the above information, please recommend an appropriate shopping list to the current user. 대답형식은 {\"shoppingList\" : [ { \"foodName\" : <string>, \"reason\" : <TEXT>},]}Please respond in Korean according to JSON format like this."
    const systemp = "Your name is \"왓마냉(wimn)\" The function you are providing is an intelligent secretary who communicates with users. When you answer, you have to answer with ONLY JSON format according to the specified form. Do not say another response."
    console.log(prompt);
    const message = messageGenerator(systemp, prompt, cacheddialog);
    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: message,
        temperature: 0,
        top_p: 1
    });
    const duration = Date.now() - start;
    console.log(response.data.choices[0].message.content);
    callback(response.data.choices[0].message.content, newDialog);
    console.log(duration / 1000);

}

const getRecipe = async (userNo, newDialog, f, u, c, callback) => {
    const start = Date.now();
    console.log(newDialog);
    let foods = f;
    let userInfo = u;
    let cacheddialog = c;

    let prompt = "User information for the current conversation: " + await userInfo + "\
    User Refrigerator's Ingredients List: " + await foods + "\
    User Ask : \"" + newDialog +"\"\
    Based on the above information, please recommend an appropriate recipe to the current user. The answer format is {\"recipeName\": <string>, \"process\": [ <List : string> ]}Please respond in Korean according to JSON format like this."
    const systemp = "Your name is \"왓마냉(wimn)\" The function you are providing is an intelligent secretary who communicates with users. When you answer, you have to answer with ONLY JSON format according to the specified form. Do not say another response."
    console.log(prompt);
    const message = messageGenerator(systemp, prompt, cacheddialog);
    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: message,
        temperature: 0,
        top_p: 1
    });
    const duration = Date.now() - start;
    console.log(response.data.choices[0].message.content);
    callback(response.data.choices[0].message.content, newDialog);
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
                attributes: ["no", "username", "essentialdata"],
                where: { no: userNo },
                raw: true
            })
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                next(err);
            });
    },

};

const processs = {

    initNang: async (req, res, next) => {
        let userNo = req.params.userNo;
        let userF = false;
        logger.info(JSON.stringify(req.params));
        var array = [{
            food: "삼겹살",
            deadline: "2023-06-15",
            capacity: 2,
            is_new: 0,
            user_no: userNo,
        }, {
            food: "대파",
            deadline: "2023-06-7",
            capacity: 1,
            is_new: 0,
            user_no: userNo,
        }, {
            food: "양파",
            deadline: "2023-06-15",
            capacity: 0,
            is_new: 0,
            user_no: userNo,
        },
        {
            food: "고추가루",
            deadline: "2040-01-01",
            capacity: 999,
            is_new: 0,
            user_no: userNo,
        }];
        for (let food of array) {
            db.foods
                .create(
                    food
                )
                .then((result) => {
                    userF = true;
                    console.log(result);
                })
                .catch((error) => {
                    userF = false;
                    next(error);
                });
        }
        res.status(201).send({ result: true });


    },
    checkIntense: async (req, res, next) => {
        let question = req.body.userAsk;
        getIntense(1, question, function (responses) {
            console.log(responses)
        });
        res.status(202).send();
    },
    checkQeued: async (req, res, next) => {
        let userNo = req.params.userNo;

        db.user
            .findOne(
                { where: { no: userNo } }
            ).then((result) => {
                if (result.isQeued) res.status(200).send("OK");
                else res.status(204).send("NoContent");
            })
            .catch((error) => {
                next(error);
            });

    },
    createOpeningDialog: async (req, res, next) => {

        let userNo = req.params.userNo;
        let foods;
        db.foods
            .findAll({
                attributes: ["food", "deadline", "is_new", "capacity"],
                where: { user_no: userNo },
                raw: true
            })
            .then((result) => {
                getOpeningDialog(result, function (dialogs) {
                    console.log(dialogs);
                    db.qeue
                        .create(
                            {
                                order: 0,
                                wimnchat: dialogs,
                                types: 3,
                                user_no: userNo
                            }
                        ).then((results) => {
                            console.log(results);
                            db.user
                                .update({
                                    isQeued: true
                                }, { where: { no: userNo } }).then((results) => {
                                    logger.info(JSON.stringify(results));
                                })
                                .catch((error) => {
                                    next(error);
                                })
                        })
                        .catch((error) => {
                            next(error);
                        })
                });
            })
            .catch((error) => {
                next(error);
            });

        res.status(202).send();

    },
    popDialog: async (req, res, next) => {
        let userNo = req.params.userNo;
        logger.info(JSON.stringify(req.params));

        db.qeue
            .findAll(
                { where: { user_no: userNo }, order: [['order', 'ASC']] }
            )
            .then((result) => {

                res.status(200).send(result)
                db.qeue
                    .destroy(
                        { where: { user_no: userNo } }
                    )
                    .then((result) => {
                        logger.info(result);
                    })
                    .catch((error) => {
                        next(error);
                    })
                db.user
                    .update({
                        isQeued: false
                    }, { where: { no: userNo } }).then((results) => {
                        logger.info(JSON.stringify(results));
                    })
                    .catch((error) => {
                        next(error);
                    })
            })
    },
    flushCache: async (req, res, next) => {
        let data = req.params;
        let userN = data.userNo;
        db.cacheddialog
            .destroy(
                { where: { user_no: userN } }
            ).then((result) => {
                logger.info(result);
                res.status(200).send();
            })
            .catch((erorr) => {
                next(erorr);
            })
    },
    userAsk: async (req, res, next) => {
        let data = req.body;
        let userNo = data.userNo;
        let ask = data.dialog;
        let foods;
        let userInfo;
        let cacheddialog;
        logger.info(JSON.stringify(req.body));
        let flag = false;
        if (data == null) {
            res.json({ results: false, message: "No request body" });
            return;
        }
        console.log(ask);
        getIntense(userNo, ask, function (Chatresp, userN, userdial) {

            db.foods
                .findAll(
                    { attributes: ["food", "deadline", "capacity"], where: { user_no: userNo }, raw: true }
                )
                .then((result) => {
                    foods = JSON.stringify(result);
                    db.user
                        .findOne({ attributes: ["username", "essentialdata"], where: { no: userNo }, raw: true })
                        .then((result) => {
                            userInfo = JSON.stringify(result);
                            db.cacheddialog
                                .findAll({
                                    attributes: ["order", "userchat", "wimnchat"],
                                    where: { user_no: userNo }, raw: true, order: [['order', 'ASC']]
                                })
                                .then((result) => {
                                    cacheddialog = JSON.stringify(result);
                                    if (Chatresp == 3) {
                                        getDaily(userNo, ask, foods, userInfo, cacheddialog, function (text, origin) {
                                            let orders;
                                            db.qeue
                                                .findAll({
                                                    where: { user_no: userNo }
                                                })
                                                .then((result) => {
                                                    let cnt = result.length + 1;
                                                    db.qeue
                                                        .create({
                                                            order: cnt,
                                                            wimnchat: text,
                                                            types: 3,
                                                            user_no: userNo,
                                                        })
                                                        .then((result) => {
                                                            logger.info(JSON.stringify(result));
                                                        })
                                                        .catch((error => {
                                                            next(error);
                                                        }))
                                                })
                                                .catch((error => {
                                                    next(error);
                                                }))
                                            db.user
                                                .update({
                                                    isQeued: true
                                                }, { where: { no: userNo } })
                                                .then((results) => {
                                                    logger.info(JSON.stringify(results));
                                                })
                                                .catch((error) => {
                                                    next(error);
                                                })
                                            db.cacheddialog
                                                .findAll(
                                                    { where: { user_no: userNo }, raw: true }
                                                )
                                                .then((results) => {
                                                    orders = results.length + 1;
                                                    console.log("sunjae");
                                                    console.log(origin);
                                                    db.cacheddialog
                                                        .create({
                                                            user_no: userNo,
                                                            userchat: origin,
                                                            wimnchat: text,
                                                            order: orders,
                                                        })
                                                        .then((results) => {
                                                            flag = true;
                                                        })
                                                        .catch((err) => {
                                                            next(err);
                                                        });
                                                })
                                                .catch((err) => {
                                                    next(err);
                                                });



                                        })
                                    }
                                    else if (Chatresp == 1) {
                                        getRecipe(userNo, ask, foods, userInfo, cacheddialog, function (text, origin) {
                                            let orders;
                                            console.log("this is Recipe "+ text);
                                            db.qeue
                                                .findAll({
                                                    where: { user_no: userNo }
                                                })
                                                .then((result) => {
                                                    let cnt = result.length + 1;
                                                    db.qeue
                                                        .create({
                                                            order: cnt,
                                                            wimnchat: text,
                                                            types: 1,
                                                            user_no: userNo,
                                                        })
                                                        .then((result) => {
                                                            logger.info(JSON.stringify(result));
                                                        })
                                                        .catch((error => {
                                                            next(error);
                                                        }))
                                                })
                                                .catch((error => {
                                                    next(error);
                                                }))
                                            db.user
                                                .update({
                                                    isQeued: true
                                                }, { where: { no: userNo } })
                                                .then((results) => {
                                                    logger.info(JSON.stringify(results));
                                                })
                                                .catch((error) => {
                                                    next(error);
                                                })
                                            db.cacheddialog
                                                .findAll(
                                                    { where: { user_no: userNo }, raw: true }
                                                )
                                                .then((results) => {
                                                    orders = results.length + 1;
                                                    console.log("sunjae");
                                                    console.log(origin);
                                                    db.cacheddialog
                                                        .create({
                                                            user_no: userNo,
                                                            userchat: origin,
                                                            wimnchat: text,
                                                            order: orders,
                                                        })
                                                        .then((results) => {
                                                            flag = true;
                                                        })
                                                        .catch((err) => {
                                                            next(err);
                                                        });
                                                })
                                                .catch((err) => {
                                                    next(err);
                                                });



                                        })
                                    }
                                    else if (Chatresp == 2) {
                                        getShoppingList(userNo, ask, foods, userInfo, cacheddialog, function (text, origin) {
                                            let orders;
                                            db.qeue
                                                .findAll({
                                                    where: { user_no: userNo }
                                                })
                                                .then((result) => {
                                                    let cnt = result.length + 1;
                                                    db.qeue
                                                        .create({
                                                            order: cnt,
                                                            wimnchat: text,
                                                            types: 2,
                                                            user_no: userNo,
                                                        })
                                                        .then((result) => {
                                                            logger.info(JSON.stringify(result));
                                                        })
                                                        .catch((error => {
                                                            next(error);
                                                        }))
                                                })
                                                .catch((error => {
                                                    next(error);
                                                }))
                                            db.user
                                                .update({
                                                    isQeued: true
                                                }, { where: { no: userNo } })
                                                .then((results) => {
                                                    logger.info(JSON.stringify(results));
                                                })
                                                .catch((error) => {
                                                    next(error);
                                                })
                                            db.cacheddialog
                                                .findAll(
                                                    { where: { user_no: userNo }, raw: true }
                                                )
                                                .then((results) => {
                                                    orders = results.length + 1;
                                                    console.log("sunjae");
                                                    console.log(origin);
                                                    db.cacheddialog
                                                        .create({
                                                            user_no: userNo,
                                                            userchat: origin,
                                                            wimnchat: text,
                                                            order: orders,
                                                        })
                                                        .then((results) => {
                                                            flag = true;
                                                        })
                                                        .catch((err) => {
                                                            next(err);
                                                        });
                                                })
                                                .catch((err) => {
                                                    next(err);
                                                });



                                        })
                                    }
                                }
                                )
                                .catch((error => {
                                    console.log(error);
                                }))
                        })
                        .catch((error) => {
                            console.log(error);
                        })
                })
                .catch((error) => {
                    console.log(error);
                })



        });
        res.status(202).send();

    },




};

module.exports = {
    data,
    processs,
};