const db = require("../models");
const logger = require("../modules/winton");
const bcrypt = require("bcrypt");
const saltRounds = 10;

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
    signIn: async (req, res, next) => {
        let id = req.body.user_id;
        let user_pw = req.body.user_pw;
        logger.info(JSON.stringify(req.body));
        if (!id || !user_pw) {
            res.json({ results: false, message: "No request body" });
            return;
        }
        db.user
            .findOne({
                attributes: ["no", "id", "password", "username"],
                where: { id: id },
            })
            .then((results) => {
                if (!results) {
                    res.json({ results: false, message: "No User" });
                    return;
                }
                user = JSON.parse(JSON.stringify(results));
                if (user.id === id) {
                    if (bcrypt.compareSync(user_pw, user.password)) {
                        logger.info("Sign In Success");
                        req.session.user_no = user.no;
                        req.session.user_id = user.id;
                        req.session.isLogined = true;
                        req.session.save((err) => {
                            if (err) next(err);
                            res.json({ results: true, username: user.username });
                        });
                    } else {
                        logger.error("pw not equal");
                        res.json({ results: false });
                    }
                } else {
                    logger.error("id not equal");
                    res.json({ results: false });
                }
            })
            .catch((err) => {
                next(err);
            });
    },
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