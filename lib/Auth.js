function Auth(app) {
    var crypto = require('crypto');
    var everyauth = app.everyauth;
    var Usuario = app.db.model('Usuario');
    console.log("====================================================");
    everyauth.password
    .loginWith('email')
    .getLoginPath('/login') // Uri path to the login page
    .postLoginPath('/login') // Uri path that your login form POSTs to
    .loginView('login')
    .authenticate( function (email, password) {
      var errors = [];
      if (!email) errors.push('Missing login');
      if (!password) errors.push('Missing password');
      if (errors.length) return errors;
      var promise = this.Promise();
       Usuario.findOne({ email: email}, function (err, user) {
         if (err) {
            console.log("LOGIN ERROR: ");
            console.log(err);
            return promise.fulfill([err]);
          }
          console.log(user);
          if (!user) return ['Inicio de sesión fallido!'];
          var crypt_key = app.crypt_key;
          var decrypted_password = crypto.createHmac('sha1', crypt_key).update(password).digest('hex');
          console.log(decrypted_password);
          if (user.contrasena != decrypted_password) {
            console.log("Password comparison failed");
            return promise.fulfill(['Inicio de sesión fallido']);
          }
          console.log("Password verification ok!");
          app.login_email = user.email
          
          promise.fulfill(user);
       });
       return promise;
    })
    .loginSuccessRedirect('/equipamientos') // Where to redirect to after a login

      // If login fails, we render the errors via the login view template,
      // so just make sure your loginView() template incorporates an `errors` local.
      // See './example/views/login.jade'

    .getRegisterPath('/register') // Uri path to the registration page
    .postRegisterPath('/register') // The Uri path that your registration form POSTs to
    .registerView('')
    .validateRegistration( function (newUserAttributes) {
      // Validate the registration input
      // Return undefined, null, or [] if validation succeeds
      // Return an array of error messages (or Promise promising this array)
      // if validation fails
      //
      // e.g., assuming you define validate with the following signature
      // var errors = validate(login, password, extraParams);
      // return errors;
      //
      // The `errors` you return show up as an `errors` local in your jade template
    })
    .registerUser( function (newUserAttributes) {
      // This step is only executed if we pass the validateRegistration step without
      // any errors.
      //
      // Returns a user (or a Promise that promises a user) after adding it to
      // some user store.
      //
      // As an edge case, sometimes your database may make you aware of violation
      // of the unique login index, so if this error is sent back in an async
      // callback, then you can just return that error as a single element array
      // containing just that error message, and everyauth will automatically handle
      // that as a failed registration. Again, you will have access to this error via
      // the `errors` local in your register view jade template.
      // e.g.,
      // var promise = this.Promise();
      // User.create(newUserAttributes, function (err, user) {
      //   if (err) return promise.fulfill([err]);
      //   promise.fulfill(user);
      // });
      // return promise;
      //
      // Note: Index and db-driven validations are the only validations that occur 
      // here; all other validations occur in the `validateRegistration` step documented above.
    })
    .registerSuccessRedirect('/'); // Where to redirect to after a successful registration
}

module.exports = Auth;
