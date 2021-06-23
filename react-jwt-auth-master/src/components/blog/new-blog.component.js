import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Textarea from "react-validation/build/textarea";
import CheckButton from "react-validation/build/button";
import BlogService from "../../services/blog.service";
import Select from "react-select";
import CategoryService from "../../services/category.service";
import UserService from "../../services/user.service";
import { Redirect } from "react-router-dom";
import { BiBookAdd } from "react-icons/bi";


const required = value => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const vtitle = value => {
  if (value.length < 1 || value.length > 200) {
    return (
      <div className="alert alert-danger" role="alert">
        The Title must be between 1 and 200 characters.
      </div>
    );
  }
};

const vheader = value => {
  if (value.length < 1 || value.length > 200) {
    return (
      <div className="alert alert-danger" role="alert">
        The Header must be between 1 and 200 characters.
      </div>
    );
  }
};

const vbody = value => {
  if (value.length < 1) {
    return (
      <div className="alert alert-danger" role="alert">
        The Body can not be empty.
      </div>
    );
  }
};

const vfooter = value => {
  if (value.length < 1 || value.length > 200) {
    return (
      <div className="alert alert-danger" role="alert">
        The Footer must be between 1 and 200 characters.
      </div>
    );
  }
};



export default class CreateBlog extends Component {

  constructor(props) {
    super(props);
    this.handleCreateBlog = this.handleCreateBlog.bind(this);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeHeader = this.onChangeHeader.bind(this);
    this.onChangeBody = this.onChangeBody.bind(this);
    this.onChangeFooter = this.onChangeFooter.bind(this);
    this.onChangeCategory = this.onChangeCategory.bind(this);

    this.state = {
      currentUser: undefined,
      userReady: false,
      categories: [],
      selectedCategory: "",
      title: "",
      header: "",
      body: "",
      footer: "",
      successful: false,
      message: "",
      blog: undefined
    };

  }

  handleCreateBlog(e) {

    e.preventDefault();

    this.setState({
      message: "",
      successful: false
    });

    this.form.validateAll();
    if (this.checkBtn.context._errors.length === 0) {
      BlogService.createBlog(
        this.state.selectedCategory.value,
        this.state.currentUser.id,
        this.state.title,
        this.state.header,
        this.state.body,
        this.state.footer
      ).then(
        response => {
          if (response.status === 201) {
            this.setState({
              blog: response.data
            });
            this.props.history.push("/blog/"+this.state.blog.blogId);
            window.location.reload();
          }
        },
        error => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          this.setState({
            successful: false,
            message: resMessage
          });
        }
      );
    }
  }

  onChangeTitle(e) {
    this.setState({
      title: e.target.value
    });
  }

  onChangeHeader(e) {
    this.setState({
      header: e.target.value
    });
  }

  onChangeBody(e) {
    this.setState({
      body: e.target.value
    });
  }

  onChangeFooter(e) {
    this.setState({
      footer: e.target.value
    });
  }

  onChangeCategory(e) {
    this.setState({
      selectedCategory: e
    });
  }

  componentWillMount() {
    CategoryService.getAllCategories().then(
      response => {
        this.setState({
          categories: response.data.map( category => ({ value: category.categoryId, label: category.categoryName }))
        });
      },
      error => {
        this.setState({
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()
        });
      }
    );

    const user = UserService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
        userReady: true
      });
    }

  }

  render() {

    return (
      <div>
        <br/>
        <div className="container card">
          {(this.state.userReady) ? (
              <div className="container">
                <header className="jumbotron py-6 text-center">
                    <h4><BiBookAdd/>&nbsp;&nbsp;Create a New Blog</h4>
                </header>
                <Form onSubmit={this.handleCreateBlog}
                  ref={c => {
                    this.form = c;
                  }}>
                {!this.state.successful && (
                  <div>
                    <div className="form-group">
                      <label htmlFor="category">Category</label>
                      <Select
                        value={this.state.selectedCategory}
                        onChange={this.onChangeCategory}
                        options={this.state.categories}/>
                    </div>
                    <div className="form-group">
                      <label htmlFor="title">Title</label>
                      <Input
                        type="text"
                        className="form-control"
                        name="title"
                        maxLength="200"
                        value={this.state.title}
                        onChange={this.onChangeTitle}
                        validations={[required, vtitle]}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="header">Header</label>
                      <Input
                        type="text"
                        className="form-control"
                        name="header"
                        maxLength="200"
                        value={this.state.header}
                        onChange={this.onChangeHeader}
                        validations={[required, vheader]}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="body">Body</label>
                      <Textarea
                        type="textarea"
                        className="form-control"
                        name="body"
                        value={this.state.body}
                        onChange={this.onChangeBody}
                        validations={[required, vbody]}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="footer">Footer/Signature/Dedication</label>
                      <Input
                        type="text"
                        className="form-control"
                        name="footer"
                        maxLength="200"
                        value={this.state.footer}
                        onChange={this.onChangeFooter}
                        validations={[required, vfooter]}
                      />
                    </div>
                    <div className="form-group  text-center">
                      <button className="btn btn-primary">Create Blog</button>
                    </div>
                  </div>
                )}
                {this.state.message && (
                  <div className="form-group">
                    <div className={
                        this.state.successful
                          ? "alert alert-success"
                          : "alert alert-danger"
                      }
                      role="alert">
                      {this.state.message}
                    </div>
                  </div>
                )}
                  <CheckButton
                    style={{ display: "none" }}
                    ref={c => {
                      this.checkBtn = c;
                    }}
                  />
                </Form>
              </div>
          ): (<Redirect to="/login"/>)}
        </div>
      <br/>
    </div>
    );
  }
}
