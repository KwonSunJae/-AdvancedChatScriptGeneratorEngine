const db = require("../models");
const logger = require("../modules/winton");


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
    
    signUp: async (req, res, next) => {
        let user_info = req.body;
        logger.info(JSON.stringify(req.body));
        let essentialDatas = "[\"" + user_info.loveFood + "를 좋아함.\" , \"" + user_info.danger +" 알러지가 있음.\" ]";
        console.log(essentialDatas);
        let flag = false;
        if (user_info == null) {
            res.json({ results: false, message: "No request body" });
            return;
        }
        db.user
            .create({
                username: user_info.username,
                essentialdata : essentialDatas,
                isQeued : false,
            })
            .then((results) => {
                flag = true;
                console.log(results.no);
                res.status(201).json({"no":results.no});
            })
            .catch((err) => {
                next(err);
                res.status(503).json("error");
            });

    },
    
        
};

module.exports = {
    data,
    process,
};