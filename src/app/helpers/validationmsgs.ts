const registerMessages = {
  name: {
    required: 'Full name is required',
    minlength: 'Full name must be atleast 1 characters long',
    maxlength: ' Full name must be atmost 100 characters long',
  },
  surname: {
    required: 'Surname is required',
    minlength: 'Surname must be atleast 3 characters long',
    maxlength: ' Surname must be atmost 100 characters long',
  },
  email: {
    required: 'email is required',
    email: 'Enter a valid email address',
    minlength: 'Email must be atleast 3 characters long',
  },
  password: {
    required: 'Password is required',
    minlength: 'Password must be atleast 8 characters long',
    maxlength: ' Password must be atmost 100 characters long',
  },
  confirm: {
    required: 'Password is required',
    matching: 'Passwords must match',
  },
};

const createEditMessages = {
  name: {
    required: 'Advert heading is required',
    minlength: 'Advert heading must be atleast 1 characters long',
    maxlength: ' Advert heading must be atmost 100 characters long',
  },
  province: {
    required: 'Province is required',
  },
  city: {
    required: 'City is required',
  },
  advertDetails: {
    required: 'Advert details is required',
    minlength: 'Advert details must be atleast 10 characters long',
    maxlength: ' Advert details must be atmost 1000 characters long',
  },
  price: {
    required: 'Price is required',
    min: 'Price must not be less than 10000',
    max: ' Price must not exceed a 100 million',
  },
};

const loginMessages = {
  email: {
    required: 'email is required',
    email: 'Enter a valid email address',
    minlength: '',
  },
  password: {
    required: 'Password is required',
    minlength: 'Password must be atleast 3 characters long',
    maxlength: ' Password must be atmost 100 characters long',
  },
};

export { registerMessages, loginMessages, createEditMessages };
