import React from 'react';

import { Breadcrumb, BreadcrumbItem } from 'carbon-components-react';

import { getParentComponent, getSelectedComponent } from '../../components/fragment';
import { useFragment } from '../../context';

const getAncestors = (state: any, component: any) => {
	const ancestors: any[] = [];

	// there's probably a way to optimize this function

	if (state === component) {
		return ancestors;
	}

	let parent = component;

	do {
		parent = getParentComponent(state, parent);
		ancestors.unshift(parent)
	} while (parent !== state);

	return ancestors;
}

export const SelectedComponentBreadcrumbs = ({selectedComponent}: any) => {
	const [fragment, setFragment] = useFragment();

	if (!selectedComponent) {
		selectedComponent = getSelectedComponent(fragment);
	}

	const selectComponent = (component: any) => {
		setFragment({
			...fragment,
			selectedComponentId: component.id
		}, true);
	};

	return selectedComponent && <Breadcrumb noTrailingSlash>
		{getAncestors(fragment.data, selectedComponent).map(component =>
			<BreadcrumbItem
			href="#"
			isCurrentPage={!component.type}
			onClick={(event: any) => {
				event.nativeEvent.preventDefault();
				if (!component.type) {
					// happens when clicking root element
					return;
				}
				selectComponent(component)
			}}>
				{component.type || 'root'}
			</BreadcrumbItem>
		)}
		<BreadcrumbItem href="#" onClick={(event: any) => event.nativeEvent.preventDefault()} isCurrentPage>
			{selectedComponent.type}
		</BreadcrumbItem>
	</Breadcrumb>;
};