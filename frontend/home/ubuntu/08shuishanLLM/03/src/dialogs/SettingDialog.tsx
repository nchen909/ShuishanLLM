import React from 'react'
import {
    Button,
    Alert,
    Chip,
    Dialog,
    DialogContent,
    DialogActions,
    DialogTitle,
    TextField,
    FormGroup,
    FormControlLabel,
    Switch,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Slider,
    Typography,
    Box,
} from '@mui/material'
import { Settings } from '../stores/types'
import { getDefaultSettings } from '../stores/store'
import ThemeChangeButton from '../theme/ThemeChangeIcon'
import { ThemeMode } from '../theme/index'
import { useThemeSwicher } from '../theme/ThemeSwitcher'
import { styled } from '@mui/material/styles'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion'
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary'
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp'
import { Trans, useTranslation } from 'react-i18next'
import PlaylistAddCheckCircleIcon from '@mui/icons-material/PlaylistAddCheckCircle'
import LightbulbCircleIcon from '@mui/icons-material/LightbulbCircle'

const { useEffect } = React
const models: string[] = ['gpt-3.5-turbo', 'gpt-3.5-turbo-0301', 'gpt-4', 'gpt-4-0314', 'gpt-4-32k', 'gpt-4-32k-0314']
const languages: string[] = ['en', 'zh-Hans', 'zh-Hant', 'jp']
const languageMap: { [key: string]: string } = {
    en: 'English',
    'zh-Hans': '简体中文',
    'zh-Hant': '繁體中文',
    jp: '日本語',
}
interface Props {
    open: boolean
    settings: Settings
    close(): void
    save(settings: Settings): void
}

export default function SettingDialog(props: Props) {
    const { t } = useTranslation()
    const [settingsEdit, setSettingsEdit] = React.useState<Settings>(props.settings)
    const handleRepliesTokensSliderChange = (event: Event, newValue: number | number[], activeThumb: number) => {
        if (newValue === 8192) {
            setSettingsEdit({ ...settingsEdit, maxTokens: 'inf' })
        } else {
            setSettingsEdit({ ...settingsEdit, maxTokens: newValue.toString() })
        }
    }
    const handleMaxContextSliderChange = (event: Event, newValue: number | number[], activeThumb: number) => {
        if (newValue === 8192) {
            setSettingsEdit({ ...settingsEdit, maxContextSize: 'inf' })
        } else {
            setSettingsEdit({ ...settingsEdit, maxContextSize: newValue.toString() })
        }
    }
    const handleTemperatureChange = (event: Event, newValue: number | number[], activeThumb: number) => {
        if (typeof newValue === 'number') {
            setSettingsEdit({ ...settingsEdit, temperature: newValue })
        } else {
            setSettingsEdit({ ...settingsEdit, temperature: newValue[activeThumb] })
        }
    }
    const handleRepliesTokensInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        if (value === 'inf') {
            setSettingsEdit({ ...settingsEdit, maxTokens: 'inf' })
        } else {
            const numValue = Number(value)
            if (!isNaN(numValue) && numValue >= 0) {
                if (numValue > 8192) {
                    setSettingsEdit({ ...settingsEdit, maxTokens: 'inf' })
                    return
                }
                setSettingsEdit({ ...settingsEdit, maxTokens: value })
            }
        }
    }
    const handleMaxContextInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        if (value === 'inf') {
            setSettingsEdit({ ...settingsEdit, maxContextSize: 'inf' })
        } else {
            const numValue = Number(value)
            if (!isNaN(numValue) && numValue >= 0) {
                if (numValue > 8192) {
                    setSettingsEdit({ ...settingsEdit, maxContextSize: 'inf' })
                    return
                }
                setSettingsEdit({ ...settingsEdit, maxContextSize: value })
            }
        }
    }

    const [, { setMode }] = useThemeSwicher()
    useEffect(() => {
        setSettingsEdit(props.settings)
    }, [props.settings])

    const onCancel = () => {
        props.close()
        setSettingsEdit(props.settings)

        // need to restore the previous theme
        setMode(props.settings.theme ?? ThemeMode.System)
    }

    // preview theme
    const changeModeWithPreview = (newMode: ThemeMode) => {
        setSettingsEdit({ ...settingsEdit, theme: newMode })
        setMode(newMode)
    }

    return (
        <Dialog open={props.open} onClose={onCancel} fullWidth>
            <DialogTitle>{t('settings')}</DialogTitle>
            <DialogContent>
                <FormControl fullWidth variant="outlined" margin="dense">
                    <InputLabel htmlFor="language-select">{t('language')}</InputLabel>
                    <Select
                        label="language"
                        id="language-select"
                        value={settingsEdit.language}
                        onChange={(e) => {
                            setSettingsEdit({ ...settingsEdit, language: e.target.value })
                        }}
                    >
                        {languages.map((language) => (
                            <MenuItem key={language} value={language}>
                                {languageMap[language]}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl sx={{ flexDirection: 'row', alignItems: 'center', paddingTop: 1, paddingBottom: 1 }}>
                    <span style={{ marginRight: 10 }}>{t('theme')}</span>
                    <ThemeChangeButton value={settingsEdit.theme} onChange={(theme) => changeModeWithPreview(theme)} />
                </FormControl>
                <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                    <InputLabel>Font Size</InputLabel>
                    <Select
                        labelId="select-font-size"
                        value={settingsEdit.fontSize}
                        label="FontSize"
                        onChange={(event) => {
                            setSettingsEdit({ ...settingsEdit, fontSize: event.target.value as number })
                        }}
                    >
                        {[12, 13, 14, 15, 16, 17, 18].map((size) => (
                            <MenuItem key={size} value={size}>
                                {size}px
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormGroup>
                    <FormControlLabel
                        control={<Switch />}
                        label={t('show word count')}
                        checked={settingsEdit.showWordCount}
                        onChange={(e, checked) => setSettingsEdit({ ...settingsEdit, showWordCount: checked })}
                    />
                </FormGroup>
                <FormGroup>
                    <FormControlLabel
                        control={<Switch />}
                        label={t('show estimated token count')}
                        checked={settingsEdit.showTokenCount}
                        onChange={(e, checked) => setSettingsEdit({ ...settingsEdit, showTokenCount: checked })}
                    />
                </FormGroup>


            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>{t('cancel')}</Button>
                <Button onClick={() => props.save(settingsEdit)}>{t('save')}</Button>
            </DialogActions>
        </Dialog>
    )
}

const Accordion = styled((props: AccordionProps) => <MuiAccordion disableGutters elevation={0} square {...props} />)(
    ({ theme }) => ({
        border: `1px solid ${theme.palette.divider}`,
        '&:not(:last-child)': {
            borderBottom: 0,
        },
        '&:before': {
            display: 'none',
        },
    }),
)

const AccordionSummary = styled((props: AccordionSummaryProps) => (
    <MuiAccordionSummary expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />} {...props} />
))(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
    },
}))

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
}))
