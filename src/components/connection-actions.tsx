"use client";

import { useActionState } from "react";
import Link from "next/link";
import { answerQuestion, updateConnectionState } from "@/server/discovery/actions";

type State = { error?: string } | undefined;

export function AnswerForm({ questionId, connectionId, prompt }: { questionId: string; connectionId: string; prompt: string }) {
  const [state, action, pending] = useActionState(answerQuestion, undefined as State);
  return <form action={action} className="answer-form"><input type="hidden" name="questionId" value={questionId} /><input type="hidden" name="connectionId" value={connectionId} /><label className="field"><span>{prompt}</span><textarea name="answer" maxLength={500} required rows={3} placeholder="Answer in your own words..." /></label>{state?.error && <p className="form-error" role="alert">{state.error}</p>}<button className="button button-primary" disabled={pending}>{pending ? "Saving..." : "Reveal yours"}</button></form>;
}

export function ConnectionStateForm({ connectionId, state, label, quiet = false }: { connectionId: string; state: string; label: string; quiet?: boolean }) {
  const [result, action, pending] = useActionState(updateConnectionState, undefined as State);
  return <><Link className="button button-primary" href={`/chat/${connectionId}`}>Open conversation</Link><form action={action}><input type="hidden" name="connectionId" value={connectionId} /><input type="hidden" name="nextState" value={state} /><button className={`button ${quiet ? "button-quiet" : "button-primary"}`} disabled={pending}>{pending ? "Updating..." : label}</button>{result?.error && <p className="form-error" role="alert">{result.error}</p>}</form></>;
}
