const functions = require("firebase-functions");
var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");
const cors = require("cors")({ origin: true });
const sgMail = require("@sendgrid/mail");
const { async } = require("@firebase/util");
const API_KEY = functions.config().sendgrid.key;
const TEMPLATE_ID = functions.config().sendgrid.template;
sgMail.setApiKey(API_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://sunday-school-7fe91-default-rtdb.firebaseio.com",
});

exports.grantAdminRole = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const user = await admin.auth().getUserByEmail(req.body.email);
    admin
      .auth()
      .setCustomUserClaims(user.uid, {
        admin: true,
      })
      .then(() => {
        res.json({ status: "success" });
        console.log("admin true");
      });
  });
});

exports.createTeacher = functions.https.onCall(async (data, context) => {
  const password = Math.random().toString(36).slice(-8);
  if (context.auth.token.admin) {
    var _data = {
      name: data.name,
      email: data.email,
      mob: data.mob,
      class_id: data.class_id,
    };
    var user = { email: data.email, password: password };
    var createdTime = admin.firestore.FieldValue.serverTimestamp();
    console.log("User :", user);
    return admin
      .auth()
      .createUser(user)
      .then(async (_user) => {
        await admin
          .firestore()
          .collection("teacher")
          .add({
            ..._data,
            uid: _user.uid,
            created: createdTime,
            updated: null,
            is_deleted: false,
            isNewUser: true,
            role: {
              admin: false,
              teacher: true,
              student: false,
            },
          });
        await admin.auth().setCustomUserClaims(_user.uid, {
          teacher: true,
        });
        await sendWelcomeEmail(_data.name, _data.email, password);
      })
      .catch((error) => {
        return error;
      });
  }
});

async function sendWelcomeEmail(name, email, password) {
  // var user = { name: data.name, email: data.email, password: data.password };
  const msg = {
    to: email,
    from: "schoolsunday766@gmail.com",
    templateId: TEMPLATE_ID,
    dynamic_template_data: {
      name: name,
      email: email,
      password: password,
    },
  };
  console.log(msg);
  return sgMail.send(msg);
}

exports.createStudent = functions.https.onCall(async (data, context) => {
  const password = Math.random().toString(36).slice(-8);
  if (context.auth.token.admin || context.auth.token.teacher) {
    var user = { email: data.email, password: password };
    var createdTime = admin.firestore.FieldValue.serverTimestamp();
    return admin
      .auth()
      .createUser(user)
      .then(async (_user) => {
        await admin.firestore().collection("student").add({
          ...data,
          uid: _user.uid,
          created: createdTime,
          updated: null,
          is_deleted: false,
          isNewUser: true,
          role: {
            admin: false,
            teacher: false,
            student: true,
          },
        }).then((result) => {
          return result;
        });
        await admin.auth().setCustomUserClaims(_user.uid, {
          student: true,
        });
        await sendWelcomeEmail(data.name, data.email, password)
      })
      .catch((error) => {
        return error;
      });
  }
});

exports.onUpdateParent = functions.firestore
  .document("/parent/{parentId}")
  .onUpdate(async (snap, context) => {
    const parentId = context.params.parentId;
    var studentBatch = admin.firestore().batch();
    if (
      snap.after.data().name !== snap.before.data().name ||
      snap.after.data().mob !== snap.before.data().mob
    ) {
      let data = null;
      //if the parent name changes
      if (snap.after.data().name !== snap.before.data().name)
        data.parent_name = snap.after.data().name;

      //if parent mob changes
      if (snap.after.data().mob !== snap.before.data().mob)
        data.parent_mob = snap.after.data().mob;

      //find students whose parent details changed
      let students = await admin
        .firestore()
        .collection("student")
        .where("parent_id", "==", parentId)
        .get();
      students.forEach((student) => {
        // admin.firestore().collection('student').doc(student.id) equals student.ref
        studentBatch.update(student.ref, {
          ...data,
        });
      });
      //changes are applied only when commit()
      await studentBatch.commit();
    }
    return null;
  });

exports.updatePassword = functions.https.onCall(async (data, context) => {
  const password = Math.random().toString(36).slice(-8);
  admin
    .auth()
    .updateUser(data.uid, { password: password })
    .then(() => {
      sendWelcomeEmail(data.name, data.email, password);
      console.log("Password updated on resend mail");
    })
    .catch((error) => {
      console.log("Error on resend mail", error);
    });
});

//Sends email to user after signup SENDGRID
