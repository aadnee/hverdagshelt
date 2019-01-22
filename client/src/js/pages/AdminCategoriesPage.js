import React from 'react';
import { Component } from 'react';
import { Grid, Container, Divider, Header, Segment, Button, Modal, Form, Label } from 'semantic-ui-react';
import { AdminCategoriesWidget } from '../widgets/AdminCategoriesWidget';
import { categoryService } from '../services/CategoryServices';
import { toast } from 'react-toastify';

//import {} from './../widgets';

export class AdminCategoriesPage extends Component {
  constructor(props) {
    super(props);
    this.selectedCat = this.selectedCat.bind(this);
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
      console.log(res.data);
      this.setState({ categories: res.data });
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

  deleteCategory = () => {
    categoryService.deleteCategory(this.state.selectedCategory.id).then(res => {
      if (res.success) {
        toast.success(res.message.no, { position: toast.POSITION.TOP_RIGHT });
        if (res.success) {
          if (this.state.selectedCategory.parentId) {
            console.log('sub');
            this.state.categories.find((category, mainIndex) => {
              if (category.id === this.state.selectedCategory.parentId) {
                console.log(mainIndex, 'mainIndex');
                category.subs.find((subCategory, subIndex) => {
                  if (subCategory.id === this.state.selectedCategory.id) {
                    console.log(subIndex, 'sunIndex');
                    let subarr = this.state.categories[mainIndex].subs;
                    subarr.splice(subIndex, 1);

                    let mainCat = this.state.categories;

                    mainCat[mainIndex] = {
                      id: this.state.categories[mainIndex].id,
                      name: this.state.categories[mainIndex].name,
                      active: 1,
                      parentId: null,
                      subs: subarr
                    };

                    this.setState({ categories: mainCat });

                    console.log(this.state.categories);
                  }
                });
              }
            });
          } else {
            console.log('main');
            this.state.categories.find((category, index) => {
              if (this.state.selectedCategory.id === category.id) {
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

  editCategory = () => {
    categoryService.editCategory(this.state.selectedCategory.id, this.state.newName).then(res => {
      res.success
        ? toast.success(res.message.no, { position: toast.POSITION.TOP_RIGHT })
        : toast.error(res.message.no, { position: toast.POSITION.TOP_RIGHT });
      if (res.success) {
        if (this.state.selectedCategory.parentId) {
          console.log('sub', this.state.selectedCategory);
          this.state.categories.find((category, mainIndex) => {
            if (this.state.selectedCategory.parentId === category.id) {
              category.subs.find((subCategory, subIndex) => {
                if (subCategory.id === this.state.selectedCategory.id) {
                  console.log(subIndex, 'subIndex');
                  let subarr = this.state.categories[mainIndex].subs;
                  subarr.splice(subIndex, 1, {
                    id: this.state.selectedCategory.id,
                    name: this.state.newName,
                    active: 1,
                    parentId: this.state.selectedCategory.parentId
                  });

                  let mainCat = this.state.categories;

                  mainCat[mainIndex] = {
                    id: this.state.categories[mainIndex].id,
                    name: this.state.categories[mainIndex].name,
                    active: 1,
                    parentId: null,
                    subs: subarr
                  };

                  this.setState({ categories: mainCat });

                  console.log(this.state.categories);
                }
              });
            }
          });
        } else {
          console.log('main', this.state.selectedCategory);
          this.state.categories.find((category, index) => {
            if (category.id === this.state.selectedCategory.id) {
              let mainCat = this.state.categories;
              mainCat.splice(index, 1, {
                id: this.state.selectedCategory.id,
                name: this.state.newName,
                active: 1,
                parentId: this.state.selectedCategory.parentId
              });

              this.setState({ categories: mainCat });
            }
          });
        }
      }
    });
    this.close();
  };

  addCategory = (name, id) => {
    categoryService.addCategory(name, id).then(res => {
      if (res.success) {
        toast.success(res.message.no, { position: toast.POSITION.TOP_RIGHT });
        if (id) {
          console.log(id, 'id');
          this.state.categories.find((category, index) => {
            if (category.id === id) {
              let subarr = this.state.categories[index].subs;
              subarr.push({
                id: res.id,
                name: name,
                active: 1,
                parentId: id
              });

              let mainCat = this.state.categories;

              mainCat[index] = {
                id: this.state.categories[index].id,
                name: this.state.categories[index].name,
                active: 1,
                parentId: null,
                subs: subarr
              };

              this.setState({ categories: mainCat });

              console.log(this.state.categories);
            }
          });
        } else {
          let mainCat = this.state.categories;

          mainCat.push({
            id: res.id,
            name: name,
            active: 1,
            parentId: null,
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
          <Button.Group floated="right">
            <Button positive content="Rediger" onClick={this.open} />
            <Button negative content="Slett" onClick={this.deleteCategory} />
          </Button.Group>
          <p>Marker kategori og velg om du vil slette eller endre</p>
          <Grid divided>
            <Grid.Column>
              <AdminCategoriesWidget
                mainCategory={this.state.mainCategory}
                addCategory={this.addCategory}
                categories={this.state.categories}
                func={this.selectedCat}
              />
            </Grid.Column>
          </Grid>
        </Segment>
        <Modal size="tiny" open={this.state.openEdit} onClose={this.close}>
          <Modal.Header>Endre navn på kategori: {this.state.selectedCategory.name}</Modal.Header>
          <Modal.Content>
            <Header as="h3">Endre navn:</Header>
            <Form.Input
              fluid
              placeholder="Name"
              name="newName"
              value={this.state.newName}
              onChange={(event, data) => {
                this.handleChange('newName', data.value);
              }}
            />
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={this.close} negative>
              Avbryt
            </Button>
            <Button positive onClick={this.editCategory} icon="checkmark" labelPosition="right" content="Endre" />
          </Modal.Actions>
        </Modal>
      </Container>
    );
  }
}
