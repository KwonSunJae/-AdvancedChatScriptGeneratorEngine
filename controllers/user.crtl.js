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
        let essentialDatas = "[\"" + user_info.loveFood + "를 좋아함.\" , \"" + user_info.dagner +" 알러지가 있음.\" ]";
        let flag = false;
        if (user_info == null) {
            res.json({ results: false, message: "No request body" });
            return;
        }
        db.user
            .create({
                username: user_info.username,
                essentialData : user_info.essentialDatas,
            })
            .then((results) => {
                flag = true;
            })
            .catch((err) => {
                next(err);
            });

        if (flag) {
            db.user
                .findOne({
                    attributes : ["no"],
                    where : { username : user_info.username}
                })
                .then((results)=>{
                    res.json(results);
                    
                })
                .catch((err)=>{
                    next(err);
                });
        }
    },
    
        
};

module.exports = {
    data,
    process,
};