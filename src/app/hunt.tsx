import { useState } from 'react';
import { router } from 'expo-router';
import { Platform, Share, Text } from 'react-native';
import { Badge, Button, Card, Copy, Progress, Row, Screen, Sheet, Title, c } from '@/components/demo/ui';
import { CampusMap } from '@/components/demo/campus-map';
import { FriendPicker } from '@/components/demo/friend-picker';
import { pets, useDemo } from '@/state/demo';
export default function Hunt() {
    const { state, dispatch } = useDemo();
    const [step, setStep] = useState(0);
    const [started, setStarted] = useState(false);
    const [invite, setInvite] = useState(false);
    const [invited, setInvited] = useState<string[]>([]);
    const [summary, setSummary] = useState(false);
    const [found, setFound] = useState(false);
    const [sharing, setSharing] = useState(false);
    const [shareNote, setShareNote] = useState('');
    const [abandon, setAbandon] = useState(false);
    const pet = pets.find(p => p.id === state.activePet)!;
    const complete = state.completed.includes('hunt');
    const message = `I found ${pet.name} near the coffee cart in FitTamer! +60 XP and a mystery egg. A little move, a big adventure. (Demo hunt)`;
    async function share() { if (Platform.OS === 'web') {
        setSharing(true);
        return;
    } try {
        await Share.share({ message });
    }
    catch {
        setSharing(true);
    } }
    return <Screen title={`Find ${pet.name}.`} subtitle="Follow the feeling. Your companion is somewhere nearby." back>
    <Row><Badge>{complete ? 'HUNT COMPLETE' : 'CAMPUS HIDE & SEEK'}</Badge><Button label="Invite aaaaaaa" secondary onPress={() => setInvite(true)}/></Row>
    <CampusMap hunt progress={complete ? 3 : step}/>
    <Progress value={(complete ? 3 : step) / 3 * 100} label={['Cold… time to explore', 'Warmer! You’re on the right track', 'Getting hot! Look nearby', 'Found! Behind the coffee cart'][complete ? 3 : step]}/>
    {invited.length > 0 && <Card tint={c.lime}><Copy>💬 {invited[0]}: “You’ve got this! Keep exploring!”</Copy><Copy muted>{invited.join(', ')} {invited.length === 1 ? 'is' : 'are'} cheering in this demo.</Copy></Card>}
    <Card><Row><Title>{step === 3 || complete ? `${pet.name} is back home!` : `Where could ${pet.name} be?`}</Title><Badge tone="yellow">+60 XP</Badge></Row><Copy muted>{started ? 'Try the coffee cart. A warm drink and a happy reunion.' : 'Explore the shaded hint zone. There’s no exact pin to follow.'}</Copy><Copy>Reward: 🥚 Mystery egg · +30 energy</Copy>{complete ? <Button label="See hunt summary" onPress={() => setSummary(true)}/> : !started ? <Button label="Start hunt →" onPress={() => { setStarted(true); dispatch({ type: 'mood', mood: 'Hiding' }); }}/> : step < 3 ? <Button label="Demo: keep walking →" onPress={() => { setStep(v => v + 1); if (step === 2)
        setFound(true); }}/> : <Button label={`Catch ${pet.name}!`} onPress={() => setFound(true)}/>}</Card>
    {started && !complete && <Button label="End hunt for now" secondary onPress={() => setAbandon(true)}/>}
    <FriendPicker visible={invite} onClose={() => setInvite(false)} selected={invited} onChange={setInvited} hunt/>
    <Sheet visible={found} title={`You found ${pet.name}!`} onClose={() => setFound(false)}><Text style={{ fontSize: 95, textAlign: 'center' }}>{pet.emoji}</Text><Copy>Hiding behind the coffee cart. A little wander was all it took.</Copy><Button label={`Catch ${pet.name} ✨`} onPress={() => { dispatch({ type: 'quest', id: 'hunt', xp: 60 }); setFound(false); setSummary(true); }}/></Sheet>
    <Sheet visible={summary} title="A happy little reunion." onClose={() => setSummary(false)}><Text style={{ fontSize: 70, textAlign: 'center' }}>{pet.emoji}💚</Text><Title>+60 XP · 🥚 Mystery egg</Title><Copy>+30 energy · 10 simulated movement minutes</Copy><Copy muted>Found near the coffee cart. {invited.length} demo friends cheered you on.</Copy><Button label="Share hunt summary" secondary onPress={share}/><Button label="Back home →" onPress={() => router.replace('/')}/></Sheet>
    <Sheet visible={sharing} title="Share your adventure" onClose={() => setSharing(false)}><Copy>{message}</Copy><Copy muted>Use your browser’s share menu, or copy this summary.</Copy><Button label="Copy summary" onPress={async () => { try {
        await navigator.clipboard.writeText(message);
        setShareNote('Copied!');
    }
    catch {
        setShareNote('Copy isn’t available here. Select the summary text to share.');
    } }}/><Copy>{shareNote}</Copy></Sheet>
    <Sheet visible={abandon} title="Another time is okay." onClose={() => setAbandon(false)}><Copy>Your companion will find its way home. Come back whenever you’re ready.</Copy><Button label="Back home" onPress={() => { dispatch({ type: 'mood', mood: 'Happy' }); router.replace('/'); }}/></Sheet>
  </Screen>;
}
