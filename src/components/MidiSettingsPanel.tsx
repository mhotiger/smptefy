import {
	AccordionButton,
	AccordionIcon,
	AccordionPanel,
} from '@chakra-ui/accordion';
import {
	AccordionItem,
	Box,
	Flex,
	Grid,
	GridItem,
	Select,
	Text,
} from '@chakra-ui/react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'state';

interface MidiSettingsPanelProps {}

export const MidiSettingsPanel: React.FC<MidiSettingsPanelProps> = ({}) => {
	const inputs = useSelector((state: RootState) => state.midi.player.inputs);
	const outputs = useSelector(
		(state: RootState) => state.midi.player.outputs
	);

	const inputItems = inputs.map((input, i) => {
		return <option value={i}>{input.name}</option>;
	});
	const outputItems = outputs.map((output, i) => {
		return <option value={i}>{output.name}</option>;
	});

	const dispatch = useDispatch();

	const handleInputChange: React.ChangeEventHandler<HTMLSelectElement> = (
		e
	) => {
		console.log('input change: ', e.target.value);
	};

	const handleOutputChange: React.ChangeEventHandler<HTMLSelectElement> = (
		e
	) => {
		console.log('outputChange: ', e.target.value);
	};
	return (
		<AccordionItem>
			<AccordionButton>
				<Box flex='1' textAlign='left'>
					Midi Settings
				</Box>
				<AccordionIcon />
			</AccordionButton>
			<AccordionPanel>
				{inputs && (
					<Grid
						m='0.3rem'
						templateColumns='repeat(4,1fr)'
						templateRows='repeat(1,1fr)'>
						<GridItem colSpan={1}>
							<Text m='0.2rem'>Input</Text>
						</GridItem>
						<GridItem colSpan={3}>
							<Select
								size='sm'
								m='0.2rem'
								onChange={handleInputChange}>
								{inputItems}
							</Select>
						</GridItem>
					</Grid>
				)}
				{outputs && (
					<Grid
						m='0.3rem'
						templateColumns='repeat(4,1fr)'
						templateRows='repeat(1,1fr)'>
						<GridItem colSpan={1}>
							<Text m='0.2rem'>Output</Text>
						</GridItem>
						<GridItem colSpan={3}>
							<Select
								size='sm'
								m='0.2rem'
								onChange={handleOutputChange}>
								{outputItems}
							</Select>
						</GridItem>
					</Grid>
				)}
			</AccordionPanel>
		</AccordionItem>
	);
};
