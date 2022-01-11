const registerMessages = {
  name: {
    required: '',
    minlength: '',
    maxlength: ' ',
  },
  surname: {
    required: '',
    minlength: '',
    maxlength: '',
  },
  email: {
    required: '',
    email: '',
    minlength: '',
  },
  oldPassword: {
    required: '',
    matching: '',
  },
  password: {
    required: '',
    minlength: '',
    maxlength: '',
  },
  confirm: {
    required: '',
    matching: '',
  },
};

const createEditMessages = {
  name: {
    required: '',
    minlength: '',
    maxlength: ' ',
  },
  province: {
    required: '',
  },
  city: {
    required: '',
  },
  advertDetails: {
    required: '',
    minlength: '',
    maxlength: ' ',
  },
  price: {
    required: '',
    min: '',
    max: '',
  },
};

const loginMessages = {
  email: {
    required: '',
    minlength: '',
    email: '',
    maxlength: '',
  },
  password: {
    required: '',
    minlength: '',
    maxlength: ' ',
  },
  phone: {
    minlength: '',
    maxlength: ' ',
  },
};

const contactMessages = {
  name: {
    required: '',
    minlength: '',
    maxlength: '',
  },
  email: {
    required: '',
    email: '',
    minlength: '',
    maxlength: '',
  },
  message: {
    required: '',
    minlength: '',
    maxlength: ' ',
  },
};

export { registerMessages, loginMessages, createEditMessages, contactMessages };
