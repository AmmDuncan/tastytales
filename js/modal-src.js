const modal = document.querySelector(".modal");
const backContent = document.querySelectorAll("section");
const modalCard = document.querySelector(".modal .card");
const offerBtns = document.querySelectorAll(".offer-card .btn");

modal.addEventListener("click", function (e) {
  if (e.target === modal) {
    closeModal();
  }
});

function closeModal() {
  modal.classList.remove("open");
  document.body.style.overflow = "auto";
  backContent.forEach((item) => (item.style.filter = "blur(0)"));
}

modalCard.addEventListener("click", function (e) {
  if (e.target.classList.contains("close")) {
    closeModal();
  }
});

let INDEX = 0;

function openModal(e) {
  e.preventDefault();
  let index = parseInt(e.target.dataset.index);
  modal.classList.add("open");
  document.body.style.overflow = "hidden";
  backContent.forEach((item) => (item.style.filter = "blur(.2rem)"));

  callSetOrder(index);
}

function callSetOrder(index) {
  this.setOrder(index);
}

offerBtns.forEach((btn) => {
  btn.addEventListener("click", openModal);
});

class Root extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      order: cakes[INDEX],
      active: cakes[INDEX].common,
      done: false,
    };
    window.callSetOrder = window.callSetOrder.bind(this);
  }

  changeSize = (size) => {
    this.setState(({ order, active }) => {
      return {
        order,
        active: parseInt(size),
      };
    });
  };

  setOrder = (ind) => {
    this.setState(({ order, active }) => ({
      order: cakes[ind],
      active: cakes[ind].common,
      done: false,
    }));
  };

  completeOrder = () => {
    this.setState(({ order, active, done }) => ({
      order,
      active,
      done: true,
    }));
  };

  render() {
    let children = this.state.order.sizes.map((size) => (
      <SizeCard
        key={size}
        size={size}
        active={size === this.state.active}
        changeActive={this.changeSize}
      />
    ));

    let { order, active } = this.state;
    let key = active.toString();
    let price = parseFloat(order.prices[key]);
    price = price.toFixed(2);

    if (!this.state.done) {
      return (
        <>
          <h2>Order - {this.state.order.name}</h2>
          <div className="price">
            GH¢{price}
            <div className="small">
              *<strong>Not</strong> including delivery
            </div>
          </div>

          <SizeCardContainer>{children}</SizeCardContainer>

          <UserForm done={this.completeOrder} />

          <div className="close">
            <img src="img/close.svg" alt="close" />
          </div>
        </>
      );
    } else {
      return (
        <>
          {/*<h2>Order - {this.state.order.name}</h2>*/}

          <div className="orderComplete">
            <div className="img">
              <img src="img/email-done.svg" alt="" />
            </div>
            <h3>Done!</h3>
            <p>
              We will contact you to confirm your order within a few minutes.
            </p>
          </div>

          <div className="close">
            <img src="img/close.svg" alt="close" />
          </div>
        </>
      );
    }
  }
}

class SizeCardContainer extends React.Component {
  render() {
    return <div className="size-cards">{this.props.children}</div>;
  }
}

class SizeCard extends React.Component {
  changeActive = (e) => {
    this.props.changeActive(e.target.dataset.size);
  };

  render() {
    let { size, active } = this.props;
    return (
      <div
        className={`size-card ${active ? "active" : ""}`}
        data-size={size}
        onClick={this.changeActive}
      >
        {this.props.size}
        <span className="small">Inch</span>
      </div>
    );
  }
}

class UserForm extends React.Component {
  state = {
    fields: {
      name: "",
      whatsapp: "",
      instagram: "",
    },
    fieldErrors: {
      name: "",
      whatsapp: "",
      instagram: "",
    },
    error: "",
  };

  onInputChange = (e) => {
    let fields = { ...this.state.fields };
    fields[e.target.name] = e.target.value;

    this.setState({
      fields,
    });
    if (e.target.name === "whatsapp") {
      this.validateWholeForm(e.target.value, (name = false));
    } else if (e.target.name === "name") {
      this.setState(({ fields, fieldErrors, error }) => {
        return {
          fields,
          fieldErrors: Object.assign(
            fieldErrors,
            this.validateName({ name: e.target.value })
          ),
          error,
        };
      });
    }
  };

  // imperative programming for validation (not pure functions)
  validateWholeForm = (whatsappValue, name = true) => {
    let { whatsapp, instagram } = this.state.fields;
    let error = "";
    if (whatsappValue) whatsapp = whatsappValue;
    if (!whatsapp && !instagram) {
      error = "Provide either your whatsapp number or instagram handle";
    }
    // whatsappValue is provided user that for whatsapp validation
    let fields = whatsappValue ? { whatsapp } : { ...this.state.fields };
    let whatsappErrors = this.validateWhatsAppContact(fields);

    let nameErrors = {};
    if (name) nameErrors = this.validateName({ ...this.state.fields });

    let fieldErrors = Object.assign({}, whatsappErrors, nameErrors);

    this.setState(({ fields }) => {
      return { fields, fieldErrors, error };
    });

    for (let key in fieldErrors) {
      if (fieldErrors[key] !== "") return false;
    }

    if (error !== "") return false;

    return true;
  };

  validateWhatsAppContact = (fields) => {
    let errors = {};

    let { whatsapp, instagram } = fields;

    if (whatsapp && !instagram) {
      if (!validator.isMobilePhone(whatsapp, ["en-GH"])) {
        errors.whatsapp = "Invalid phone number";
      } else {
        errors.whatsapp = "";
      }
    }

    return errors;
  };

  validateName = (fields) => {
    let { name } = fields;
    let errors = {};

    if (!name) {
      errors.name = "Name Is Required";
    } else {
      errors.name = "";
    }

    return errors;
  };

  onFormSubmit = (e) => {
    e.preventDefault();
    let valid = this.validateWholeForm();
    if (valid) this.props.done();
  };

  render() {
    return (
      <form className="row" onSubmit={this.onFormSubmit}>
        <div className="d-flex align-items-center">
          <label htmlFor="name" className="d-flex">
            Name: <span className="color-red">*</span>
          </label>
          <input
            type="text"
            placeholder="John"
            name="name"
            id="name"
            className="form-control form-control-sm"
            onChange={this.onInputChange}
          />
        </div>
        <div className="small color-red mt-1">
          {this.state.fieldErrors.name}
        </div>
        <div className="d-flex align-items-center mt-1">
          <label htmlFor="whatsapp">WhatsApp:</label>
          <input
            type="text"
            placeholder="02XXXXXXXX"
            name="whatsapp"
            id="whatsapp"
            className="form-control form-control-sm"
            onChange={this.onInputChange}
          />
        </div>
        <div className="small color-red mt-1">
          {this.state.fieldErrors.whatsapp}
        </div>
        <div className="d-flex align-items-center mt-1">
          <label htmlFor="instagram">Instagram: </label>
          <input
            type="text"
            placeholder="@yourhandle"
            name="instagram"
            id="instagram"
            className="form-control form-control-sm"
            onChange={this.onInputChange}
          />
        </div>
        <div className="small color-red">{this.state.error}</div>

        <div className="d-flex align-items-center justify-content-center mt-3 mb-0">
          <input
            type="submit"
            value="Place Order"
            className="btn btn-dark form-control"
          />
        </div>
      </form>
    );
  }
}

ReactDOM.render(<Root />, document.querySelector(".modal .card"));
