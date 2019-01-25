import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { HeaderWidget } from './../src/js/widgets/HeaderWidget';
import {FooterWidget} from "../src/js/widgets/FooterWidget";
import {ShortCutWidget} from "../src/js/widgets/ShortCutWidget";

describe('Client tests', () => {
  it('initially', () => {
    expect([]).toHaveLength(0);
  });
});

describe('ShortCutWidget test', () => {
    const wrapper = shallow(
        <ShortCutWidget/>
    );
    it('Sjekker at shortcut-ene inneholder de tre linkene', () => {
        expect(wrapper.find('NavLink').length).toEqual(3);
    });
});

describe('Header test', () => {
    const wrapper = shallow(
        <HeaderWidget/>
    );
    it('Sjekker at Headeren inneholder meny-knappen', () => {
        expect(wrapper.find('Menu').length).toEqual(1);
    });
});

describe('Footer test', () => {
    const wrapper = shallow(
        <FooterWidget/>
    );
    it('Sjekker at footeren inneholder liste med info', () => {
        expect(wrapper.find('List').length).toEqual(1);
    });
});