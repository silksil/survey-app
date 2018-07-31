const keys = require('../../config/keys')

module.exports = (survey) => {

  return `
    <html>
      <body>
        <div style="text-align": center;">
          <h3> I'd lik eyour input!</h3>
          <p> Please answer the following questions: </p>
          <p>${survey.body}</p>
          <div>
            <a href="${keys.redirectDomain}/api/surveys/${survey.id}/thanks"/yes>Yes</a>
          </div>
          <div>
            <a href="${keys.redirectDomain}/api/surveys/${survey.id}/thanks"/no>No</a>
          </div>
          <h3> I'd lik eyour input!</h3>
        </div>
      </body>
    </html>
  `;
};
