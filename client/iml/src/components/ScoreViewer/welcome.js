export default `
# Students

You can view your team scores here. For individual scores, please check in with your coach.

# Coaches

With this site, you'll have to register your students once, and after that you only have to worry about recording attendance and entering scores.
The process for recording attendance is currently very slow (and being improved), but in its current form the application should still save you time over the old process.

That being said, if you have any feature requests, complaints, or ideas of how we could make the user interface better, please email _gilvir@nyciml.org_.

## Usage:
* Register an account, entering one of the three codes emailed to you.
    * If you did not receive a code, please email __support@nyciml.org__.
    * Make sure you use a secure password! We salt and hash passwords so you should be covered as long as you dont use "password" or "123456".
* After registering, your account will automatically be linked to your school profile that was auto-generated using the registration data you entered during the Fall. If you want any of this information updated, please contact us!
    * If you're missing access to any divisions, or have access to extra divisions, let us know.
    * This information can be found on the "Manage School" page, using the menu icon on the top left to open the navigation.
* The "Manage School" page has tabs dedicated to managing all your students, managing team meta-info and creating teams, and managing team membership.
    * For adding teams and members, use the + icon on the top right and remember to press check. There should be dialogs on the bottom left that pop up to let you know if you're entering something wrong.
        * Keep in mind you can only specify 4 alternates per division, you cannot add alternates to teams, and you cannot edit some of this information if you've already begun entering scores.
        * While it's best if all the information is accurate before you begin entering scores, if you have a problem you cannot resolve please contact us so we can manually make the change.
* Once you've created your teams and students, you can begin entering scores in the "Add Score" page, simply select the competition you wish to enter scores for (be careful that you have the right one selected).
* Before you can add scores, you have to enter attendance information (who is present/what alternates are competing for what team)--this validation is very important for ensuring alternates are only used when necessary. In the near future, you can expect a button that will enter default attendance (all members present, no alternates) for you, from which point you can edit. We apologize for the rather time-consuming process until that point.
* Once you enter attendance info, you can move on to entering scores using the "Next" button on the bottom.
    * In order to speed up the process, you can use __tab__ to navigate forward to the next checkbox or button, and __space__ to toggle or press the button.
    * The first action button is for uploading scores to the server, __if you do not press it your score changes will not be saved__. The next button is for reloading the scores from the server, which is useful if you made any accidental changes. The third is a button for deleting the scores from the server (changing attendance status to "Absent" will have the same effect and will make sure they don't show up where they're not supposed to or prevent alternates from being used).
    *  When you update scores for a given student, the corresponding action button will change in color from grey to red.

 `
