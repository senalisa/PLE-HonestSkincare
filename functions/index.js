const functions = require("firebase-functions");
const admin = require("firebase-admin");
const ModerationApi = require("@moderation-api/sdk").default;

admin.initializeApp();

const moderationApi = new ModerationApi({
  key: "proj_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NzJjMGY5NWE1MWE5ZjYxNGM0NGIyNiIsInVzZXJJZCI6IjY2NzJjMDk5MzA4OGRkY2YwOGJiNjE1ZSIsInRpbWVzdGFtcCI6MTcxODc5NjUzNzIyNCwiaWF0IjoxNzE4Nzk2NTM3fQ.tqKHfS1_27DpNMST2qoAOBPN8lCB1eW1wTnatmNhbAg",
});

exports.detectSpamPost = functions.firestore
  .document("posts/{postId}")
  .onCreate(async (snap, context) => {
    const postData = snap.data();
    const postId = context.params.postId;

    try {
      const analysis = await moderationApi.moderate.text({
        value: postData.content,
        authorId: postData.authorId || "unknown",
        contextId: postId,
        metadata: {
          customField: "value",
        },
      });

      if (analysis.flagged) {
        // Verwijder spam post
        await snap.ref.delete();
        console.log(`Post ${postId} was flagged and deleted.`);
      } else {
        console.log(`Post ${postId} was not flagged.`);
      }
    } catch (error) {
      console.error("Error calling Moderation API:", error);
    }

    return null;
  });
