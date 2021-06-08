"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const modal = document.querySelector('.modal');
const modalCard = document.querySelector('.modal .card');
const offerBtns = document.querySelectorAll('.offer-card .btn');
modal.addEventListener('click', function (e) {
  if (e.target === modal) {
    closeModal();
  }
});

function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = "auto";
}

modalCard.addEventListener('click', function (e) {
  if (e.target.classList.contains('close')) {
    closeModal();
  }
});
let INDEX = 0;

function openModal(e) {
  modal.classList.add('open');
  document.body.style.overflow = "hidden";
  let index = parseInt(e.target.dataset.index);
  callSetOrder(index);
  e.preventDefault();
}

function callSetOrder(index) {
  this.setOrder(index);
}

offerBtns.forEach(btn => {
  btn.addEventListener('click', openModal);
});

class Root extends React.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "changeSize", size => {
      this.setState(({
        order,
        active
      }) => {
        return {
          order,
          active: parseInt(size)
        };
      });
    });

    _defineProperty(this, "setOrder", ind => {
      this.setState(({
        order,
        active
      }) => ({
        order: cakes[ind],
        active: cakes[ind].common
      }));
    });

    this.state = {
      order: cakes[INDEX],
      active: cakes[INDEX].common
    };
    window.callSetOrder = window.callSetOrder.bind(this);
  }

  render() {
    let children = this.state.order.sizes.map(size => /*#__PURE__*/React.createElement(SizeCard, {
      key: size,
      size: size,
      active: size === this.state.active,
      changeActive: this.changeSize
    }));
    let {
      order,
      active
    } = this.state;
    let key = active.toString();
    let price = parseFloat(order.prices[key]);
    price = price.toFixed(2);
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h2", null, "Order - ", this.state.order.name), /*#__PURE__*/React.createElement("div", {
      className: "price"
    }, "GH\xA2", price, /*#__PURE__*/React.createElement("div", {
      className: "small"
    }, "*", /*#__PURE__*/React.createElement("strong", null, "Not"), " including delivery")), /*#__PURE__*/React.createElement(SizeCardContainer, null, children), /*#__PURE__*/React.createElement(UserForm, null), /*#__PURE__*/React.createElement("div", {
      className: "close"
    }, /*#__PURE__*/React.createElement("img", {
      src: "img/close.svg",
      alt: "close"
    })));
  }

}

class SizeCardContainer extends React.Component {
  render() {
    return /*#__PURE__*/React.createElement("div", {
      className: "size-cards"
    }, this.props.children);
  }

}

class SizeCard extends React.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "changeActive", e => {
      this.props.changeActive(e.target.dataset.size);
    });
  }

  render() {
    let {
      size,
      active
    } = this.props;
    return /*#__PURE__*/React.createElement("div", {
      className: `size-card ${active ? "active" : ""}`,
      "data-size": size,
      onClick: this.changeActive
    }, this.props.size, /*#__PURE__*/React.createElement("span", {
      className: "small"
    }, "Inch"));
  }

}

class UserForm extends React.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "state", {
      fields: {
        name: "",
        whatsapp: "",
        instagram: ""
      },
      fieldErrors: {
        name: "",
        whatsapp: "",
        instagram: ""
      },
      error: ""
    });

    _defineProperty(this, "onInputChange", e => {
      let fields = { ...this.state.fields
      };
      fields[e.target.name] = e.target.value;
      this.setState({
        fields
      });
    });

    _defineProperty(this, "validateWholeForm", () => {
      let {
        name,
        whatsapp,
        instagram
      } = this.state.fields;
      let error = "Provide either your whatsapp number or instagram handle";

      if (!whatsapp && !instagram) {
        this.setState({
          fields: {
            name,
            whatsapp,
            instagram
          },
          error
        });
      } else {
        error = "";
        this.setState({
          fields: {
            name,
            whatsapp,
            instagram
          },
          error
        });
      }
    });

    _defineProperty(this, "validateWhatsAppContact", () => {
      let {
        whatsapp,
        instagram
      } = this.state.fields;

      if (whatsapp && !instagram) {
        if (!validatePhone(whatsapp)) {
          this.setState(({
            fields,
            fieldErrors,
            error
          }) => {
            return {
              fields,
              fieldErrors: Object.assign({}, fieldErrors, {
                whatsapp: "Invalid phone number"
              })
            };
          });
        } else {
          this.setState(({
            fields,
            fieldErrors,
            error
          }) => {
            return {
              fields,
              fieldErrors: Object.assign({}, fieldErrors, {
                whatsapp: ""
              })
            };
          });
        }
      }
    });

    _defineProperty(this, "validateName", () => {
      let {
        name
      } = this.state.fields;

      if (!name) {
        this.setState(({
          fields,
          fieldErrors,
          error
        }) => {
          return {
            fields,
            fieldErrors: Object.assign({}, fieldErrors, {
              name: "Name cannot be empty"
            })
          };
        });
      } else {
        this.setState(({
          fields,
          fieldErrors,
          error
        }) => {
          return {
            fields,
            fieldErrors: Object.assign({}, fieldErrors, {
              name: ""
            })
          };
        });
      }
    });

    _defineProperty(this, "onFormSubmit", e => {
      e.preventDefault();
      this.validateWholeForm();
      this.validateWhatsAppContact();
      this.validateName();
    });
  }

  render() {
    return /*#__PURE__*/React.createElement("form", {
      className: "row",
      onSubmit: this.onFormSubmit
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex align-items-center"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "name",
      className: "d-flex"
    }, "Name: ", /*#__PURE__*/React.createElement("span", {
      className: "color-red"
    }, "*")), /*#__PURE__*/React.createElement("input", {
      type: "text",
      placeholder: "John",
      name: "name",
      id: "name",
      className: "form-control form-control-sm",
      onChange: this.onInputChange
    })), /*#__PURE__*/React.createElement("div", {
      className: "small color-red mt-1"
    }, this.state.fieldErrors.name), /*#__PURE__*/React.createElement("div", {
      className: "d-flex align-items-center mt-1"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "whatsapp"
    }, "WhatsApp:"), /*#__PURE__*/React.createElement("input", {
      type: "text",
      placeholder: "02XXXXXXXX",
      name: "whatsapp",
      id: "whatsapp",
      className: "form-control form-control-sm",
      onChange: this.onInputChange
    })), /*#__PURE__*/React.createElement("div", {
      className: "small color-red mt-1"
    }, this.state.fieldErrors.whatsapp), /*#__PURE__*/React.createElement("div", {
      className: "d-flex align-items-center mt-1"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "instagram"
    }, "Instagram: "), /*#__PURE__*/React.createElement("input", {
      type: "text",
      placeholder: "@yourhandle",
      name: "instagram",
      id: "instagram",
      className: "form-control form-control-sm",
      onChange: this.onInputChange
    })), /*#__PURE__*/React.createElement("div", {
      className: "small color-red"
    }, this.state.error), /*#__PURE__*/React.createElement("div", {
      className: "d-flex align-items-center justify-content-center mt-3 mb-0"
    }, /*#__PURE__*/React.createElement("input", {
      type: "submit",
      value: "Place Order",
      className: "btn btn-dark form-control"
    })));
  }

}

ReactDOM.render( /*#__PURE__*/React.createElement(Root, null), document.querySelector(".modal .card"));