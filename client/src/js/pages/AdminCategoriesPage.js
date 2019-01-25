import React from 'react';
import { Component } from 'react';
import { Grid, Container, Divider, Header, Segment, Button, Modal, Form, Label, Dropdown } from 'semantic-ui-react';
import { AdminCategoriesWidget } from '../widgets/AdminCategoriesWidget';
import { categoryService } from '../services/CategoryServices';
import { toast } from 'react-toastify';

//import {} from './../widgets';

export class AdminCategoriesPage extends Component {
  constructor(props) {
    super(props);
    this.addCategory = this.addCategory.bind(this);
    this.state = {
      newCategoryName: '',
      newName: '',
      openEdit: false,
      selectedCategory: '',
      categories: []
    };
  }

  componentWillMount() {
    categoryService.getCategories().then(res => {
      let listCat = [];
      let listSubCat = [];
      res.data.map((cat, index) => {
        cat.subs.map((sub, subIndex) => {
          listSubCat.push({
            value: sub.id,
            key: subIndex,
            text: sub.name,
            parentid: sub.parentId,
            name: sub.name,
            id: sub.id
          });
        });
        listCat.push({
          value: cat.id,
          key: index,
          text: cat.name,
          parentid: cat.parentId,
          name: cat.name,
          id: cat.id,
          subs: listSubCat
        });
        listSubCat = [];
      });

      this.setState({ categories: listCat });
    });
  }

  open = () => {
    this.state.selectedCategory
      ? this.setState({ openEdit: true, newName: this.state.selectedCategory.name })
      : toast.info('Velg kategori', { position: toast.POSITION.TOP_RIGHT });
  };

  close = () => {
    this.setState({ openEdit: false });
  };

  handleChange = (name, value) => this.setState({ [name]: value });

  selectedCat = selCat => {
    this.setState({ selectedCategory: selCat });
  };

  deleteCategory = selectedCat => {
    categoryService.deleteCategory(selectedCat.id).then(res => {
      if (res.success) {
        toast.success(res.message.no, { position: toast.POSITION.TOP_RIGHT });
        if (res.success) {
          if (selectedCat.parentid) {
            this.state.categories.find((category, mainIndex) => {
              if (category.id === selectedCat.parentid) {
                category.subs.find((subCategory, subIndex) => {
                  if (subCategory.id === selectedCat.id) {
                    let subarr = this.state.categories[mainIndex].subs;
                    subarr.splice(subIndex, 1);

                    let mainCat = this.state.categories;

                    mainCat[mainIndex] = {
                      value: this.state.categories[mainIndex].id,
                      key: this.state.categories[mainIndex].key,
                      text: this.state.categories[mainIndex].text,
                      id: this.state.categories[mainIndex].id,
                      name: this.state.categories[mainIndex].name,
                      parentid: null,
                      subs: subarr
                    };

                    this.setState({ categories: mainCat });

                    return true;
                  }
                });
              }
            });
          } else {
            this.state.categories.find((category, index) => {
              if (selectedCat.id === category.id) {
                let mainCat = this.state.categories;
                mainCat.splice(index, 1);
                this.setState({ categories: mainCat, mainCategory: '' });
              }
            });
          }
          this.forceUpdate();
        } else {
          toast.error(res.message.no, { position: toast.POSITION.TOP_RIGHT });
        }
      }
    });
  };

  editCategory = (selectedCat, newName) => {
    categoryService.editCategory(selectedCat.id, newName).then(res => {
      res.success
        ? toast.success(res.message.no, { position: toast.POSITION.TOP_RIGHT })
        : toast.error(res.message.no, { position: toast.POSITION.TOP_RIGHT });
      if (res.success) {
        if (selectedCat.parentid) {
          this.state.categories.find((category, mainIndex) => {
            if (selectedCat.parentid === category.id) {
              category.subs.find((subCategory, subIndex) => {
                if (subCategory.id === selectedCat.id) {
                  let subarr = this.state.categories[mainIndex].subs;
                  subarr.splice(subIndex, 1, {
                    value: selectedCat.id,
                    key: selectedCat.key,
                    text: newName,
                    id: selectedCat.id,
                    name: newName,
                    parentid: selectedCat.parentid
                  });

                  let mainCat = this.state.categories;

                  mainCat[mainIndex] = {
                    value: this.state.categories[mainIndex].id,
                    key: this.state.categories[mainIndex].key,
                    text: this.state.categories[mainIndex].name,
                    id: this.state.categories[mainIndex].id,
                    name: this.state.categories[mainIndex].name,
                    parentid: null,
                    subs: subarr
                  };

                  this.setState({ categories: mainCat });

                  return true;
                }
              });
            }
          });
        } else {
          this.state.categories.find((category, index) => {
            if (category.id === selectedCat.id) {
              let mainCat = this.state.categories;
              mainCat.splice(index, 1, {
                value: selectedCat.id,
                key: selectedCat.key,
                text: newName,
                id: selectedCat.id,
                name: newName,
                parentid: selectedCat.parentid
              });

              this.setState({ categories: mainCat });
              return true;
            }
          });
        }
      }
    });
    this.close();
  };

  addCategory = (name, parentid) => {
    categoryService.addCategory(name, parentid).then(res => {
      if (res.success) {
        toast.success(res.message.no, { position: toast.POSITION.TOP_RIGHT });
        if (parentid) {
          this.state.categories.find((category, index) => {
            if (category.id === parentid) {
              let subarr = this.state.categories[index].subs;
              subarr.push({
                value: res.id,
                key: res.id,
                text: name,
                id: res.id,
                name: name,
                parentid: parentid
              });

              let mainCat = this.state.categories;

              mainCat[index] = {
                value: this.state.categories[index].id,
                key: this.state.categories[index].key,
                text: this.state.categories[index].name,
                id: this.state.categories[index].id,
                name: this.state.categories[index].name,
                parentid: null,
                subs: subarr
              };

              this.setState({ categories: mainCat });
            }
          });
        } else {
          let mainCat = this.state.categories;

          mainCat.push({
            value: res.id,
            key: res.id,
            text: name,
            id: res.id,
            name: name,
            parentid: null,
            subs: []
          });

          this.setState({ categories: mainCat });
        }
      } else {
        toast.error(res.message.no, { position: toast.POSITION.TOP_RIGHT });
      }
    });
  };

  render() {
    return (
      <Container>
        <Divider hidden />
        <Divider hidden />
        <Header as="h1">Administrer kategorier</Header>
        <Segment basic color="blue">
          <p>Marker kategori og velg om du vil slette eller endre</p>
          <Grid divided>
            <Grid.Column>
              <AdminCategoriesWidget
                mainCategory={this.state.mainCategory}
                addCategory={this.addCategory}
                categories={this.state.categories}
                deleteCat={this.deleteCategory.bind(this)}
                editCat={this.editCategory.bind(this)}
                addCat={this.addCategory.bind(this)}
                func={this.selectedCat}
              />
            </Grid.Column>
          </Grid>
        </Segment>
      </Container>
    );
  }
}
