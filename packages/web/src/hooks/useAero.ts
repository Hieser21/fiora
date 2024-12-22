import { useSelector } from 'react-redux';
import { State } from '../state/reducer';

/**
 * Get Frosted Glass state properly
 */
export default function useAero() {
    const aero = useSelector((state: State) => state.status.aero);
    return {
        'data-aero': aero,
    };
}
