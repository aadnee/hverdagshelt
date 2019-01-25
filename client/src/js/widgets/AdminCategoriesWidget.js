import React from 'react';
import { Component } from 'react';
import { Grid, Segment, List, Icon, Button, Header, Modal, Form, Dropdown } from 'semantic-ui-react';
import { categoryService } from '../services/CategoryServices';
import { toast } from 'react-toastify';

export class AdminCategoriesWidget extends Component {
  constructor(props) {
    super(props);

    this.selectMainCat = this.selectMainCat.bind(this);
    this.selectSubCat = this.selectSubCat.bind(this);

    this.state = {
      mainCategory: '',
      subCategory: '',
      openNewCategories: false,
      edit: '',
      name: '',
      categoriesModal: false
    };
  }

  deleteCat = cat => {
    if (cat === 'main') {
      this.props.deleteCat(this.state.mainCategory);
      this.setState({ mainCategory: '' });
    } else {
      this.props.deleteCat(this.state.subCategory);
      this.setState({ subCategory: '' });
    }
  };

  openModalNewName = edit => {
    if (edit === 'mainEdit' && this.state.mainCategory) {
      this.setState({ categoriesModal: true, edit: edit, name: this.state.mainCategory.name });
    }
    if (edit === 'subEdit' && this.state.subCategory) {
      this.setState({ categoriesModal: true, edit: edit, name: this.state.subCategory.name });
    }
    if (edit === 'newMainCat') {
      this.setState({ categoriesModal: true, edit: edit, name: '' });
    }
    if (edit === 'newSubCat') {
      this.setState({ categoriesModal: true, edit: edit, name: '' });
    }
  };

  closeModalNewName = () => {
    this.setState({ categoriesModal: false });
  };

  editCat = (cat, newName) => {
    console.log(cat);
    this.props.editCat(cat, newName);
    this.closeModalNewName();
    this.setState({ mainCategory: '', subCategory: '' });
  };

  selectSubCat = currentSubCat => {
    this.setState({ subCategory: currentSubCat });
    this.props.func(currentSubCat);
  };

  selectMainCat = currentCat => {
    this.setState({ mainCategory: currentCat, subCategory: '' });
    this.props.func(currentCat);
  };

  openModalAddCategory = mainCat => {
    if (mainCat) {
      this.setState({ mainCategory: '', openNewCategories: true });
    } else {
      this.setState({ subCategory: '', openNewCategories: true });
    }
  };

  handleChange = (name, value) => {
    console.log(name, value);
    this.setState({ [name]: value });
  };

  handleAddCategory = type => {
    if (type === 'main') {
      this.props.addCat(this.state.name, null);
    } else {
      this.props.addCat(this.state.name, this.state.mainCategory.id);
    }
    this.closeModalNewName();
  };

  render() {
    return (
      <div>
        <Segment>
          <Header as="h3">
            Hovedkategori:
            <Button.Group floated="right">
              <Button positive content="Rediger" onClick={() => this.openModalNewName('mainEdit')} />
              <Button
                negative
                content="Slett"
                onClick={() => {
                  this.deleteCat('main');
                }}
              />
            </Button.Group>
          </Header>

          <List divided relaxed size="large">
            <List.Item>
              <List.Content>
                <Button inverted color="green" fluid onClick={() => this.openModalNewName('newMainCat')}>
                  Legg til hovedkategori
                </Button>
              </List.Content>
            </List.Item>

            {this.props.categories ? (
              <Dropdown
                placeholder="Velg hovedkategori"
                fluid
                search
                selection
                onChange={(event, data) => {
                  this.props.categories.find(c => (c.id === data.value ? this.handleChange('mainCategory', c) : null));
                }}
                options={this.props.categories}
              />
            ) : null}
          </List>
        </Segment>
        {this.state.mainCategory ? (
          <Segment>
            <Header as="h3">
              Underkategorier:
              <Button.Group floated="right">
                <Button positive content="Rediger" onClick={() => this.openModalNewName('subEdit')} />
                <Button negative content="Slett" onClick={this.deleteCat} />
              </Button.Group>
            </Header>
            <List divided relaxed size="large">
              <List.Item>
                <List.Content>
                  <Button inverted color="green" fluid onClick={() => this.openModalNewName('newSubCat')}>
                    Legg til underkategorier i {this.state.mainCategory.name}
                  </Button>
                </List.Content>
              </List.Item>
              {this.state.mainCategory.subs ? (
                <Dropdown
                  placeholder="Velg underkategori"
                  fluid
                  search
                  onChange={(event, data) => {
                    this.state.mainCategory.subs.find(c =>
                      c.id === data.value ? this.handleChange('subCategory', c) : null
                    );
                  }}
                  selection
                  options={this.state.mainCategory.subs}
                />
              ) : null}
            </List>
          </Segment>
        ) : null}

        <Modal size="tiny" open={this.state.categoriesModal} onClose={this.closeModalNewName} closeIcon>
          <Modal.Header>Velg navn på kategori:</Modal.Header>
          <Modal.Content>
            <Header as="h3">Navn:</Header>
            <Form.Input
              fluid
              placeholder="Name"
              name="newName"
              value={this.state.name}
              onChange={(event, data) => {
                this.handleChange('name', data.value);
              }}
            />
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={() => this.setState({ categoriesModal: false })} negative>
              Avbryt
            </Button>
            {this.state.edit === 'mainEdit' ? (
              <Button
                positive
                onClick={() => this.editCat(this.state.mainCategory, this.state.name)}
                icon="checkmark"
                labelPosition="right"
                content="Rediger"
              />
            ) : null}
            {this.state.edit === 'subEdit' ? (
              <Button
                positive
                onClick={() => this.editCat(this.state.subCategory, this.state.name)}
                icon="checkmark"
                labelPosition="right"
                content="Rediger"
              />
            ) : null}
            {this.state.edit === 'newMainCat' ? (
              <Button
                positive
                onClick={() => this.handleAddCategory('main')}
                icon="checkmark"
                labelPosition="right"
                content="Legg til hovedkategori"
              />
            ) : null}
            {this.state.edit === 'newSubCat' ? (
              <Button
                positive
                onClick={() => this.handleAddCategory('sub')}
                icon="checkmark"
                labelPosition="right"
                content="Legg til underkategori"
              />
            ) : null}
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}
