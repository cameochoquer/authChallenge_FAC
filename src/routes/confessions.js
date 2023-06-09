const {
  listConfessions,
  createConfession,
} = require("../model/confessions.js");
const { getSession } = require("../model/session.js");
const { Layout } = require("../templates.js");

const get = (req, res) => {
    const sid = req.signedCookies.sid;
    const session = getSession(sid);
    console.log(session)
    const currentUser = session && session.user_id;
    const urlUser =  Number(req.params.user_id);
    if(currentUser !== urlUser ){
      res.status(401).send("<h1>You aren't allowed to see that</h1>")
    }
  const confessions = listConfessions(req.params.user_id);
  const title = "Your secrets";
  const content = /*html*/ `
    <div class="Cover">
      <h1>${title}</h1>
      <form method="POST" class="Stack" style="--gap: 0.5rem">
        <textarea name="content" aria-label="your confession" rows="4" cols="30" style="resize: vertical"></textarea>
        <button class="Button">Confess 🤫</button>
      </form>
      <ul class="Center Stack">
        ${confessions
          .map(
            (entry) => `
            <li>
              <h2>${entry.created_at}</h2>
              <p>${entry.content}</p>
            </li>
            `
          )
          .join("")}
      </ul>
    </div>
  `;
  const body = Layout({ title, content });
  res.send(body);
}

const post = (req, res) => {
  const sid = req.signedCookies.sid;
  const session = getSession(sid);
  const currentUser = session && session.user_id
  const content = req.body.content
  if(!currentUser || !content){
    return res.status(401).send("<h1>Confession failed</h1>");
  }
  createConfession(content, currentUser)
  res.redirect(`/confessions/${currentUser}`);
}

module.exports = { get, post };
